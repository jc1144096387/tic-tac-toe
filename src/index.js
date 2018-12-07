import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return (
        <button 
            className="square" 
            onClick={props.onClick}
        >
            {/* TODO */}
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor(props){
        super(props);
    }
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]} 
                onClick = {()=>this.props.onClick(i)}    
            />
        );
    }

    render() {
        return (
        <div>
            <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div>
        </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }
    handleClick(i){
        // 取出包含 初始squares和stepNumber（点击之前的步数）个squares,达到悔棋重下时舍弃用不到了的squares的效果
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length - 1];
        // 复制点击之前的最后一个squares
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        // 将点击之后产生的squares加入到history中
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            // 此处的history为本函数中用const定义的history即添加之前的history
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
        console.log(history.length);
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
        })
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step,move) => {
            const desc = move ?
            'Move #' + move :
            'Game statr';
            return(
                <li key={move}>
                    <a href="#" onClick={()=> this.jumpTo(move)}>{desc}</a>
                </li>
            )
        })
        
        let status;
        if(winner){
            status = 'Winner: ' + winner;
        }else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
        <div className="game">
            <div className="game-board">
            <Board 
                squares={current.squares} 
                onClick = {i=>this.handleClick(i)} 
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
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
  

function calculateWinner(squares){
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for(let i = 0; i < lines.length; i++){
        const [a,b,c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }
    return null;
}