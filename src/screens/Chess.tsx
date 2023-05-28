import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import {
  Chess as ChessJS,
  Move,
  PieceSymbol,
  Square,
  validateFen,
} from "chess.js";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { StackScreenProps } from "@react-navigation/stack";

import { ChessBoard, ChessPiece } from "../components/Chess";
import { getChessGameResult, getError } from "../helpers";
import { useStore } from "../hooks";
import { RootStackParamList } from "../types";
import { Icon } from "../utils";
import { CHESS_PIECE_MAP } from "../constants";

const allPromotions: PromotionPieceSymbol[] = ["b", "n", "q", "r"];
const chess = new ChessJS();

const Chess = ({ navigation }: Props) => {
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
  const [chessFen, setChessFen] = useStore(s => [s.chessFen, s.setChessFen]);
  const [promotions, setPromotions] = useState<Move[]>([]);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showMenu, setShowMenu] = useState(!!chessFen);
  const { width: wWidth, height: wHeight } = useWindowDimensions();
  const isPotrait = wWidth < wHeight;
  const width = isPotrait ? wWidth : wHeight - 64;
  const size = width / 8;
  const [{ board, player, isGameOver }, setState] = useState({
    player: chess.turn(),
    board: chess.board(),
    isGameOver: chess.isGameOver(),
  });

  const onTurn = () => {
    setChessFen(chess.fen());
    setState({
      player: chess.turn(),
      board: chess.board(),
      isGameOver: chess.isGameOver(),
    });
    setAvailableMoves([]);
    setPromotions([]);
  };

  const restart = () => {
    chess.reset();
    onTurn();
    closeMenu();
  };

  const movePiece = useCallback((from: Square, to: Square) => {
    const moves = chess
      .moves({ verbose: true })
      .filter(m => m.from === from && m.to === to);
    if (moves.length === 1) {
      const move = moves[0];
      chess.move(move);
      onTurn();
    } else if (moves.length > 1) promote(moves);
  }, []);

  const promote = (moves: Move[]) => {
    setPromotions(moves);
    setShowPromotionModal(true);
  };

  const onPromotion = useCallback(
    (moves: Move[], promotion: PromotionPieceSymbol) => {
      const move = moves.find(m => m.promotion === promotion);
      if (move) {
        chess.move(move);
        onTurn();
        setShowPromotionModal(false);
      }
    },
    []
  );

  const closeMenu = () => setShowMenu(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() => setShowMenu(true)}
        >
          <Icon iconComponentName='Entypo' color='#fff' iconName='menu' />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    if (isGameOver) {
      const { desc, title } = getChessGameResult(chess);
      Alert.alert(title, desc, [
        { text: "ok" },
        {
          text: "restart",
          onPress: restart,
        },
      ]);
    }
  }, [isGameOver]);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
      <ChessBoard {...{ width, availableMoves, movePiece }} />
      {board.map((row, i) =>
        row.map((piece, j) => {
          if (piece === null) return null;
          return (
            <ChessPiece
              key={piece.square}
              {...{
                piece,
                size,
                chess,
                setAvailableMoves,
                onTurn,
                promote,
                availableMoves,
                movePiece,
              }}
              position={{ x: j * size, y: i * size }}
              enabled={player === piece.color}
            />
          );
        })
      )}
      <Text>Current player: {player === "b" ? "Black" : "White"}</Text>
      <Portal>
        <Dialog visible={showMenu} onDismiss={closeMenu}>
          <Dialog.Title>Game Menu</Dialog.Title>
          <Dialog.Content>
            {!!chessFen && (
              <Button
                mode='contained'
                style={styles.button}
                onPress={() => {
                  const { ok, error } = validateFen(chessFen);
                  if (!ok) alert(getError(error));
                  else {
                    chess.load(chessFen);
                    onTurn();
                    closeMenu();
                  }
                }}
              >
                Resume
              </Button>
            )}
            <Button style={styles.button} onPress={restart} mode='contained'>
              Restart
            </Button>
            <Button mode='contained' style={styles.button} onPress={closeMenu}>
              Close
            </Button>
          </Dialog.Content>
        </Dialog>
        <Dialog visible={showPromotionModal} dismissable={false}>
          <Dialog.Title>Pick a piece for promotion</Dialog.Title>
          <Dialog.Content>
            {allPromotions.map(p => (
              <Button
                key={p}
                style={styles.button}
                onPress={() => onPromotion(promotions, p)}
                mode='contained'
                icon={CHESS_PIECE_MAP[p]}
              >
                {CHESS_PIECE_MAP[p].split("-")[1]}
              </Button>
            ))}
          </Dialog.Content>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

export default Chess;

type PromotionPieceSymbol = Exclude<PieceSymbol, "p" | "k">;
type Props = StackScreenProps<RootStackParamList, "Chess">;

const styles = StyleSheet.create({
  button: { margin: 20 },
});
