import { StyleSheet, View, Alert } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Board from "../components/Board";
import Title from "../components/Title";
import StatusLabel from "../components/StatusLabel";
import TButton from "../components/TButton";
import { playMove, buildBoard } from "../gameLogic/game";

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export default function Home({ navigation }) {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [steps, setSteps] = useState([]);
  const [lastP, setLastP] = useState(0);
  const [status, setStatus] = useState("X to play");
  const [gameOver, setGameOver] = useState(false);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [winningCells, setWinningCells] = useState([]);

  useEffect(() => {
    const loadCurrentGame = async () => {
      const savedJSON = await AsyncStorage.getItem("currentGame");
      if (savedJSON) {
        const saved = JSON.parse(savedJSON);
        setSteps(saved.steps);
        setLastP(saved.lastP);
        setBoard(buildBoard(saved.steps, saved.lastP));
        setStatus(saved.lastP % 2 === 0 ? "X to play" : "O to play");
        setWinningCells([]);
        setGameOver(false);
        setSaveEnabled(false);
        await AsyncStorage.removeItem("currentGame");
      }
    };
    loadCurrentGame();
  }, []);

  useEffect(() => {
    const newBoard = buildBoard(steps, lastP);
    setBoard(newBoard);
    checkWin(newBoard);
    updateStatus(lastP);
  }, [steps, lastP]);

  const play = (idx) => {
    if (gameOver || board[idx]) return;
    const newSteps = playMove(idx, steps, lastP);
    setSteps(newSteps);
    setLastP(newSteps.length);
  };

  const goPre = () => {
    if (lastP <= 0) return;
    setLastP(lastP - 1);
  };

  const goNxt = () => {
    if (lastP >= steps.length) return;
    setLastP(lastP + 1);
  };

  const newGame = () => {
    setSteps([]);
    setLastP(0);
    setBoard(Array(9).fill(""));
    setStatus("X to play");
    setGameOver(false);
    setSaveEnabled(false);
    setWinningCells([]);
  };

  const handleSave = () => {
    Alert.alert(
      "Save Game",
      "Do you want to save this game?",
      [
        { text: "Cancel" },
        {
          text: "Save",
          onPress: async () => {
            try {
              const savedGamesJSON = await AsyncStorage.getItem("games");
              const savedGames = savedGamesJSON ? JSON.parse(savedGamesJSON) : [];

              const gameToSave = {
                steps: [...steps],
                lastP,
                date: new Date().toLocaleString(),
              };

              savedGames.push(gameToSave);
              await AsyncStorage.setItem("games", JSON.stringify(savedGames));

              Alert.alert("Game saved!", "Your game has been saved."); 

              newGame();
            } catch (error) {
              console.log("Error saving game:", error);
            }
          },
        },
      ]
    );
  };

  const updateStatus = (currentLastP) => {
    if (gameOver) return;
    const nextPlayer = currentLastP % 2 === 0 ? "X" : "O";
    setStatus(`${nextPlayer} to play`);
  };

  const checkWin = (currentBoard) => {
    for (let combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        highlightWin(combo);
        setStatus(`${currentBoard[a]} wins`);
        setGameOver(true);
        setSaveEnabled(true);
        return;
      }
    }
    if (currentBoard.every(cell => cell !== "")) {
      setStatus("Tie");
      setGameOver(true);
      setSaveEnabled(true);
    }
  };

  const highlightWin = (combo) => {
    setWinningCells(combo);
    setGameOver(true);
    setSaveEnabled(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        <Title title="Tic Tac Toe" />

        <View style={styles.buttonPanel}>
          <TButton label="<" fun={goPre} width={30} enabled={lastP > 0} />
          <TButton label="New Game" fun={newGame} width={100} enabled={steps.length > 0} />
          <TButton label=">" fun={goNxt} width={30} enabled={lastP < steps.length} />
        </View>

        <StatusLabel status={status} />

        <Board plays={board} onPress={play} winningCells={winningCells} />

        <TButton label="Save" fun={handleSave} enabled={steps.length > 0} />

        <View style={styles.buttonPanel}>
          <TButton label="Rules" fun={() => navigation.navigate("Rules")} />
          <TButton label="Credits" fun={() => navigation.navigate("Credits")} />
          <TButton label="Load Game" fun={() => navigation.navigate("LoadGame")} width={100} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center" },
  table: { flex: 1, backgroundColor: "#ccc", margin: 10, justifyContent: "space-around", alignItems: "center" },
  buttonPanel: { flexDirection: "row", width: "90%", justifyContent: "space-around" },
});