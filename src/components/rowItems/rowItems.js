import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import style
import { style } from './style';

import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Foundation';

class RowItems extends React.PureComponent<Props> {
  render() {
    const { containerStyle, leftIconStyle, title, titleStyle, rightIconStyle, theme } = this.props;
    const styles = style(theme);
    return (
      <>
        <TouchableOpacity style={[styles.rowItem, containerStyle]} onPress={() => this.props.onPress()}>
          {this.props.leftIcon && <Icon name={this.props.leftIcon} style={[styles.leftIcon, leftIconStyle]} />}
          {this.props.leftIcon2 && <Icon1 name={this.props.leftIcon2} style={[styles.leftIcon, leftIconStyle]} />}
          {this.props.leftIcon3 && <Icon2 name={this.props.leftIcon3} style={[styles.leftIcon, leftIconStyle]} />}
          {this.props.leftIcon4 && <Icon3 name={this.props.leftIcon4} style={[styles.leftIcon, leftIconStyle]} />}
          {/* <Icon name="trash" style={[styles.leftIcon, leftIconStyle]} /> */}
          <Text style={[styles.rowItemTxt, titleStyle]}>{this.props.title}</Text>
          {this.props.rightIcon ? (
            <Icon name={this.props.rightIcon} style={[styles.rightIcon, rightIconStyle]} />
          ) : (
            <Icon name="chevron-right" style={[styles.rightIcon, rightIconStyle]} />
          )}
        </TouchableOpacity>
      </>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    alertData: state.redState.alertData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(RowItems);
