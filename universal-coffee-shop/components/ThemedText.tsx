import { Text, TextProps } from 'react-native';

// Simple themed text component for consistent styling
export default function ThemedText(props: TextProps & { type?: 'title' }) {
  return (
    <Text
      {...props}
      style={[
        { fontSize: props.type === 'title' ? 24 : 16, fontWeight: props.type === 'title' ? 'bold' : 'normal' },
        props.style,
      ]}
    >
      {props.children}
    </Text>
  );
}