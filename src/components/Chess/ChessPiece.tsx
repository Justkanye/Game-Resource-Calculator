import { Piece, Square, Chess, Move } from "chess.js";
import { Dispatch, SetStateAction, useCallback } from "react";
import {
  PanGestureHandler,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Vector } from "react-native-redash";

import { CHESS_PIECE_MAP } from "../../constants";
import { toPosition, toTranslation } from "../../helpers";
import { Icon } from "../../utils";

const ChessPiece = ({
  piece: { color, type },
  size,
  position: { x, y },
  chess,
  setAvailableMoves,
  enabled,
  onTurn,
  promote,
  availableMoves,
  movePiece,
}: Props) => {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const translateX = useSharedValue(x);
  const translateY = useSharedValue(y);
  const move = availableMoves.find(m => m.to === toPosition({ x, y }, size));
  const isHighlighted = !!move;
  const isKing = type === "k";
  const isChecked = isKing && enabled && chess.inCheck();
  const _movePiece = useCallback((from: Square, to: Square) => {
    const moves = chess
      .moves({ verbose: true })
      .filter(m => m.from === from && m.to === to);
    if (moves.length <= 1) {
      const move = moves[0];
      const { x, y } = toTranslation(move ? to : from, size);
      if (move) {
        chess.move(move);
        onTurn();
      }
      translateX.value = withTiming(x);
      translateY.value = withTiming(y);
    } else promote(moves);
  }, []);
  const showMoves = () => {
    setAvailableMoves(
      chess.moves({
        square: toPosition({ x: translateX.value, y: translateY.value }, size),
        verbose: true,
      })
    );
  };
  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      width: size,
      height: size,
    };
  }, [size, translateX, translateY]);
  const handleGesture = useAnimatedGestureHandler(
    {
      onStart: () => {
        offsetX.value = translateX.value;
        offsetY.value = translateY.value;
        runOnJS(showMoves)();
      },
      onActive: ({ translationX, translationY }) => {
        translateX.value = translationX + offsetX.value;
        translateY.value = translationY + offsetY.value;
      },
      onEnd: () => {
        const from = toPosition({ x: offsetX.value, y: offsetY.value }, size);
        const to = toPosition(
          { x: translateX.value, y: translateY.value },
          size
        );
        runOnJS(_movePiece)(from, to);
        if (from !== to) runOnJS(setAvailableMoves)([]);
      },
    },
    [translateX, translateY, offsetX, offsetX]
  );

  return (
    <PanGestureHandler onGestureEvent={handleGesture} enabled={enabled}>
      <Animated.View style={style}>
        <TouchableWithoutFeedback
          onPress={
            isHighlighted
              ? () => {
                  if (move) movePiece(move.from, move.to);
                }
              : enabled
              ? showMoves
              : undefined
          }
          style={{
            height: "100%",
            backgroundColor: isChecked
              ? "#834577"
              : isHighlighted
              ? "rgb(180,5,5)"
              : "transparent",
          }}
        >
          <Icon
            iconComponentName='MaterialCommunityIcons'
            iconName={CHESS_PIECE_MAP[type]}
            color={color === "b" ? "black" : "white"}
            size={size * 0.7}
            style={{ zIndex: 5, alignSelf: "center" }}
          />
        </TouchableWithoutFeedback>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default ChessPiece;

type Props = {
  piece: Piece;
  size: number;
  position: Vector;
  chess: Chess;
  setAvailableMoves: Dispatch<SetStateAction<Move[]>>;
  enabled: boolean;
  onTurn: () => void;
  promote: (moves: Move[]) => void;
  availableMoves: Move[];
  movePiece: (from: Square, to: Square) => void;
};
