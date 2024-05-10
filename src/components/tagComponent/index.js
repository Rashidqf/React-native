import * as React from 'react';
import { FC, useState } from 'react';
import { Pressable, SafeAreaView, Text, View, Image, ScrollView } from 'react-native';

import { style } from './style';

import { MentionInput } from 'react-native-controlled-mentions';

const renderSuggestions =
  (suggestions, theme) =>
  ({ keyword, onSuggestionPress }) => {
    if (keyword == null) {
      return null;
    }
    const styles = style(theme);
    return (
      <ScrollView style={{ maxHeight: 200 }}>
        {suggestions
          .filter(one => one.user_name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
          .map(one => (
            <Pressable
              key={one.id}
              onPress={() => onSuggestionPress({ ...one, name: one.user_name, id: one.user_id })}
              style={styles.atItemRow}
            >
              <Image source={{ uri: one?.user_image }} style={[styles.atUserImg]} />
              <Text style={styles.atUserName}>{one.user_name}</Text>
            </Pressable>
          ))}
      </ScrollView>
    );
  };

const Mentions = React.forwardRef(({ value, users, onChange, autoFocus, inputStyle, theme }, ref) => {
  const renderMentionSuggestions = renderSuggestions(users, theme);
  const styles = style(theme);
  return (
    <SafeAreaView>
      <MentionInput
        inputRef={ref}
        value={value}
        onChange={onChange}
        partTypes={[
          {
            trigger: '@',
            renderSuggestions: renderMentionSuggestions,
            textStyle: { fontWeight: 'bold', color: theme?.colors?.RED_500 },
          },

          {
            pattern:
              /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
            textStyle: { color: 'blue' },
          },
        ]}
        placeholder="Drop a message"
        placeholderTextColor={theme?.colors?.GRAY_300}
        style={[styles.msgInput, inputStyle]}
      />
    </SafeAreaView>
  );
});

export default Mentions;
