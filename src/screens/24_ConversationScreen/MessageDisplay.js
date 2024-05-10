import React from 'react';
import { Text } from 'react-native';
import { parseValue, isMentionPartType } from 'react-native-controlled-mentions';

const renderPart = (part, index, onPressText) => {
  // Just plain text
  if (!part.partType) {
    return <Text key={index}>{part.text}</Text>;
  }

  // Mention type part
  if (isMentionPartType(part.partType)) {
    return (
      <Text
        key={`${index}-${part.data?.trigger}`}
        style={part.partType.textStyle}
        onPress={() => {
          onPressText(part?.data?.id, part?.data?.name);
        }}
      >
        {part.text}
      </Text>
    );
  }

  // Other styled part types
  return (
    <>
      <Text key={`${index}-pattern`} style={part.partType.textStyle}>
        {part.text}
      </Text>
    </>
  );
};

const renderValue: FC = (value, onPressText, theme, tagColor) => {
  const { parts } = parseValue(value, [
    {
      trigger: '@',
      // textStyle: { fontWeight: 'bold', color: theme?.colors?.PURPLE_500 },
      textStyle: { fontWeight: 'bold', color: tagColor },
    },

    {
      pattern:
        /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
      textStyle: { color: 'blue' },
    },
  ]);
  return <Text>{parts.map((item, index) => renderPart(item, index, onPressText, theme))}</Text>;
};

export default renderValue;
