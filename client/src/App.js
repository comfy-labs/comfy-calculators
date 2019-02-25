import React, { Component } from "react";
import { Divider, Form, InputNumber, Statistic } from "antd";
import "./App.css";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        homeValue: null,
        loanToValue: 0.8,
        remainingBalance: null
      },
      isFormValid: false
    };
  }

  handleHomeValueChange = homeValue => {
    this.setState(state => {
      return {
        ...state,
        fields: { ...state.fields, homeValue },
        isFormValid: validateForm(state.fields)
      };
    });
  };

  handleLoanToValueChange = loanToValue => {
    this.setState(state => {
      return {
        ...state,
        fields: { ...state.fields, loanToValue },
        isFormValid: validateForm(state.fields)
      };
    });
  };

  handleRemainingBalanceChange = remainingBalance => {
    this.setState(state => {
      return {
        ...state,
        fields: { ...state.fields, remainingBalance },
        isFormValid: validateForm(state.fields)
      };
    });
  };

  render() {
    const { fields, isFormValid } = this.state;
    return (
      <div className="App">
        <Form>
          <Form.Item {...formItemLayout} label="Home Value">
            <InputNumber
              autoFocus
              formatter={formatCurrency}
              max={100000000}
              min={0}
              onChange={this.handleHomeValueChange}
              parser={parseCurrency}
              precision={2}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} label="Loan-to-Value">
            <InputNumber
              defaultValue={80}
              formatter={formatPercentage}
              max={100}
              min={0}
              onChange={this.handleLoanToValueChange}
              parser={parsePercentage}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} label="Remaining Mortgage Balance">
            <InputNumber
              formatter={formatCurrency}
              max={100000000}
              min={0}
              onChange={this.handleRemainingBalanceChange}
              parser={parseCurrency}
              precision={2}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Divider />
          <Statistic
            precision={2}
            title="HELOC Credit Limit"
            value={isFormValid ? calculateCreditLimit(fields) : 0}
          />
        </Form>
      </div>
    );
  }
}

// helpers
function calculateCreditLimit(fields) {
  const { homeValue, loanToValue, remainingBalance } = fields;
  return homeValue * loanToValue - remainingBalance;
}

function formatCurrency(value) {
  return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function parseCurrency(value) {
  return value.replace(/\$\s?|(,*)/g, "");
}

function formatPercentage(value) {
  return `${value}%`;
}

function parsePercentage(value) {
  return value.replace("%", "");
}

function validateNumber(value) {
  return typeof value === "number";
}

function validateForm(fields) {
  let isValid = true;
  for (let field in fields) {
    const isFieldValid = validateNumber(fields[field]);
    if (isValid && !isFieldValid) {
      isValid = false;
    }
  }
  return isValid;
}
