const isOperator = /[*/+-]/;
const endsWithOperator = /[*+-/]$/;
const endsWithNegativeSign = /\d[*/+-]{1}-$/;

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVal: "0",
      prevVal: "0",
      formula: "",
      evaluated: false,
    };
    this.handleOperators = this.handleOperators.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleEvaluate = this.handleEvaluate.bind(this);
    this.initialize = this.initialize.bind(this);
  }

  initialize() {
    this.setState({
      currentVal: "0",
      prevVal: "0",
      formula: "",
      evaluated: false,
    });
  }

handleOperators(e) {
  const operator = e.target.value;   let { formula, evaluated } = this.state;

  if (!this.state.currentVal.includes("Limit") && e) {
    this.setState({ currentVal: operator, evaluated: false });

 
    if (evaluated) {
      this.setState({ formula: this.state.prevVal + operator });
    } else {
  
      if (endsWithOperator.test(formula)) {
        if (operator === "-" && endsWithNegativeSign.test(formula)) {
 
          formula = formula.slice(0, -1);
        } else if (operator !== "-" && formula.endsWith("-")) {
 
          formula = formula.slice(0, -2) + operator;
        } else if (operator === "-" && formula.endsWith("*")) {
 
          formula += operator;
        } else if (operator !== "-" && endsWithOperator.test(formula)) {
 
          formula = formula.slice(0, -1) + operator;
        }
      } else {
  
        formula += operator;
      }

      this.setState({ formula });
    }
  }
}




  handleNumbers(e) {
    const value = e.target.value;
    const { currentVal, formula, evaluated } = this.state;

    if (evaluated) {
      this.setState({
        currentVal: value,
        formula: value,
        evaluated: false,
      });
    } else {
      this.setState({
        currentVal: currentVal === "0" || isOperator.test(currentVal) ? value : currentVal + value,
        formula: formula === "0" && value === "0" ? formula : formula + value,
      });
    }
  }

  handleDecimal() {
    const { currentVal, formula, evaluated } = this.state;

    if (evaluated) {
      this.setState({
        currentVal: "0.",
        formula: "0.",
        evaluated: false,
      });
    } else if (!currentVal.includes(".")) {
      this.setState({
        currentVal: currentVal + ".",
        formula: formula + ".",
      });
    }
  }

  handleEvaluate() {
    const { formula } = this.state;

    let expression = formula.replace(/x/g, "*").replace("--", "-");
    try {
      let answer = Math.round(1e12 * eval(expression)) / 1e12;  
      this.setState({
        currentVal: answer.toString(),
        formula: expression.replace(/\*/g, "⋅").replace(/-/g, "-") + "=" + answer,
        prevVal: answer,
        evaluated: true,
      });
    } catch (e) {
      this.setState({
        currentVal: "Error",
        formula: "",
        evaluated: false,
      });
    }
  }

  render() {
    return (
      <div className="calculator">
        <div className="formula" id="formula">{this.state.formula}</div>
        <input
          type="text"
          id="display"
          className="outputscreen"
          value={this.state.currentVal}
          readOnly
        />
        <table>
          <tbody>
            <tr>
              <td>
                <button id="clear" onClick={this.initialize}>
                  AC
                </button>
              </td>
            </tr>
            <tr>
              <td><button id="one" value="1" onClick={this.handleNumbers}>1</button></td>
              <td><button id="two" value="2" onClick={this.handleNumbers}>2</button></td>
              <td><button id="three" value="3" onClick={this.handleNumbers}>3</button></td>
              <td><button id="divide" value="/" onClick={this.handleOperators}>/</button></td>
            </tr>
            <tr>
              <td><button id="four" value="4" onClick={this.handleNumbers}>4</button></td>
              <td><button id="five" value="5" onClick={this.handleNumbers}>5</button></td>
              <td><button id="six" value="6" onClick={this.handleNumbers}>6</button></td>
              <td><button id="multiply" value="*" onClick={this.handleOperators}>*</button></td>
            </tr>
            <tr>
              <td><button id="seven" value="7" onClick={this.handleNumbers}>7</button></td>
              <td><button id="eight" value="8" onClick={this.handleNumbers}>8</button></td>
              <td><button id="nine" value="9" onClick={this.handleNumbers}>9</button></td>
              <td><button id="subtract" value="-" onClick={this.handleOperators}>-</button></td>
            </tr>
            <tr>
              <td><button id="decimal" value="." onClick={this.handleDecimal}>.</button></td>
              <td><button id="zero" value="0" onClick={this.handleNumbers}>0</button></td>
              <td><button id="add" value="+" onClick={this.handleOperators}>+</button></td>
              <td><button id="equals" value="=" onClick={this.handleEvaluate}>=</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById("root"));
