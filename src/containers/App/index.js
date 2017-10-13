import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { initMatrix } from "../../reducers/board";
import WebApp from "../WebApp";
import MobileApp from "../MobileApp";
import moveAudio from "../../assets/audio/move.mp3";
import popupAudio from "../../assets/audio/popup.mp3";

// Application entry
class App extends Component {
  static propTypes = {
    matrix: PropTypes.arrayOf(PropTypes.array).isRequired,
    onInit: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);

    this.state = {
      isMobile: window.innerWidth <= 768
    };
    // Control game audio
    this.audioMove = new Audio(moveAudio);
    this.audioPopup = new Audio(popupAudio);

    this.mobileDetect = this.mobileDetect.bind(this);
  }

  componentWillMount() {
    window.addEventListener("resize", this.mobileDetect, false);
    this.boardInit();
  }

  componentWillUnmount() {
    // Never forget remove event after component unmounted,
    // avoid memory leak
    window.removeEventListener("resize", this.mobileDetect, false);
  }

  mobileDetect() {
    this.setState({
      isMobile: window.innerWidth <= 768
    });
  }

  boardInit() {
    let isEmpty = true;
    for (const row of this.props.matrix) {
      for (const cell of row) {
        if (cell > 0) {
          isEmpty = false;
          break;
        }
      }
    }
    // Init empty matrix(add 2 random number to matrix)
    if (isEmpty) {
      this.props.onInit();
    }
  }

  render() {
    const { isMobile } = this.state;
    const { audioMove, audioPopup } = this;
    return (
      <div>
        {isMobile ? (
          <MobileApp audioMove={audioMove} audioPopup={audioPopup} />
        ) : (
          <WebApp audioMove={audioMove} audioPopup={audioPopup} />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  matrix: state.present.board.present.matrix
});

const mapDispatchToProps = {
  onInit: initMatrix
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
