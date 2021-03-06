import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Square extends React.Component {

  render() {
    return (
        <button className="square" onClick = {() =>
          this.props.clickHandler()}>
        {this.props.squareNumber}

        </button>
    );
  }
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        squareNumber = {this.props.squares[i]}
        clickHandler = {() => this.props.turnCheck(i)}
      />
    )
  }
  createBoard() {
     let rows = [];
     for(var i = 0; i < 3; i++){
         let squaresArray = []; //for every row
         for(var j = 0; j < 3; j++){
           squaresArray.push(this.renderSquare(3*i+j)); // [[0,1,2], [3,4,5], [6,7,8]]
         }
         rows.push(<div className="board-row">{squaresArray}</div>); //push the rows (1,2,3)
     }
     return rows;
  }

  render() {

     return (
       <div>
         {this.createBoard()}
       </div>
     );
   }
 }
class Player extends React.Component {
  static FIRST_PLAYER = 'x';
  static SECOND_PLAYER = "o"
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      histories: [Array(9).fill(null)],
      currentStep: 0,
      FisrPlayerIs: true,
      winner: null
    }
  }

  detectPlayer() {

          if(this.state.FisrPlayerIs) {
            return Player.FIRST_PLAYER;
          }
          else {
            return Player.SECOND_PLAYER;
          }

        }
  turnCheck(i)  {

      const { FisrPlayerIs, winner, currentStep} = this.state;


      const histories = this.state.histories.slice(0, currentStep + 1);
      const square = histories[histories.length - 1];
      const squareCopy = square.slice();
      if(squareCopy[i] !== null || winner) {
        return;
      }
      squareCopy[i] = this.detectPlayer();

      histories.push(squareCopy)
      this.setState({
          histories,
          FisrPlayerIs: !FisrPlayerIs,
          currentStep: currentStep + 1
      })
      this.detectWinner(squareCopy);
  }

  detectWinner(squares) {
    const {winner} = this.state;

    const currentWinner = checkWinner(squares)

    if(currentWinner) {
      this.setState({
          winner: currentWinner
      })
    }

  }

  render() {

    const {histories, winner, currentStep} = this.state;
    let status;
    if (winner) {
     status = 'Winner: ' + winner;
    } else {
     status = `Next Player: ${this.detectPlayer()}`;
    }
    const moves = histories.map((step, move) => {
     const menu = move ? `Go to ${move} move` : 'start from the beginning';
     return (
       <li key={move}>
         <button
           onClick={() => {
             this.setState({currentStep: move})
             }
           }
           >{menu}</button>
       </li>
     );
    });
    return (

      <div className="game">
        <div className="game-board">
          <Board
            squares={histories[currentStep]}
            turnCheck={(i) => this.turnCheck(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{moves}</div>

        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function checkWinner(squares) {
  const possibility = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < possibility.length; i++) {
    const [x,y,z] = possibility[i];
    if (squares[x] && squares[x] === squares[y] && squares[y] === squares[z]) {
      return squares[x];
    }
  }
  if(!squares.includes(null)) {
    return "no one";
  }
  return null;
}
