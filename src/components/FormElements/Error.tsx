import { FC } from "react";
import { Text, useTheme } from "react-native-paper";

const Error: FC<Props> = ({ error, touched }) => {
  const { colors } = useTheme();
  return error && touched ? (
    <Text
      style={{
        color: colors.error,
        fontSize: 12,
      }}
    >
      {error}
    </Text>
  ) : null;
};

export default Error;

type Props = {
  error?: string;
  touched?: boolean;
};
