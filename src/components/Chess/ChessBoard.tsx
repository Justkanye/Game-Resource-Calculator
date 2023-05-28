import { Move, Square } from "chess.js";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  TouchableWithoutFeedback,
} from "react-native";

import { CHESS_BLACK, CHESS_WHITE } from "../../constants";

const ChessSquare = ({ row, col, availableMoves, movePiece }: SquareProps) => {
  const _row = 8 - row;
  const _col = String.fromCharCode("a".charCodeAt(0) + col);
  const move = availableMoves.find(m => m.to.includes(_col + _row));
  const isHighlighted = !!move;
  const offset = row % 2 === 0 ? 1 : 0;
  const backgroundColor = isHighlighted
    ? "lightblue"
    : (col + offset) % 2 === 0
    ? CHESS_BLACK
    : CHESS_WHITE;
  const color = (col + offset) % 2 === 0 ? CHESS_WHITE : CHESS_BLACK;
  return (
    <TouchableWithoutFeedback
      disabled={!isHighlighted}
      onPress={() => {
        if (move) movePiece(move.from, move.to);
      }}
    >
      <View style={styles.squareContainer(backgroundColor, isHighlighted)}>
        <Text style={styles.text(color, col === 0)}>{_row}</Text>
        <Text style={styles.text(color, row === 7, true)}>{_col}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const Row = ({ row, availableMoves, movePiece }: RowProps) => (
  <View style={styles.rowContainer}>
    {new Array(8).fill(0).map((_, col) => (
      <ChessSquare key={col} {...{ col, row, availableMoves, movePiece }} />
    ))}
  </View>
);

const ChessBoard = ({ width, availableMoves, movePiece }: Props) => (
  <View style={styles.boardContainer(width)}>
    {new Array(8).fill(0).map((_, row) => (
      <Row key={row} {...{ row, availableMoves, movePiece }} />
    ))}
  </View>
);

export default ChessBoard;

const styles: BoardStyleSheet = {
  boardContainer: width => ({ width, height: width }),
  rowContainer: { flex: 1, flexDirection: "row" },
  squareContainer: (backgroundColor, isHighlighted) => ({
    flex: 1,
    padding: 4,
    justifyContent: "space-between",
    backgroundColor,
    borderWidth: isHighlighted ? StyleSheet.hairlineWidth : 0,
    borderColor: "#786",
  }),
  text: (color, visible, alignSelf) => ({
    color,
    fontWeight: "500",
    opacity: visible ? 1 : 0,
    ...(alignSelf ? { alignSelf: "flex-end" } : {}),
  }),
};

type RowProps = {
  row: number;
  availableMoves: Move[];
  movePiece: (from: Square, to: Square) => void;
};
type Props = {
  width: number;
  availableMoves: Move[];
  movePiece: (from: Square, to: Square) => void;
};

interface SquareProps extends RowProps {
  col: number;
}

type BoardStyleSheet = {
  boardContainer: (width: number) => StyleProp<ViewStyle>;
  rowContainer: StyleProp<ViewStyle>;
  squareContainer: (
    backgroundColor: string,
    isHighlighted: boolean
  ) => StyleProp<ViewStyle>;
  text: (
    color: string,
    visible: boolean,
    alignSelf?: boolean
  ) => StyleProp<TextStyle>;
};
