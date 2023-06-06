import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Operator = '+' | '-' | 'x' | '÷';

@Component({
  selector: 'calculator-main',
  templateUrl: './calculator-main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorMainComponent {
  operand = signal<string>('0');
  operationChain = signal<(number | Operator)[]>([]);
  operator = signal<Operator | undefined>(undefined);

  result = computed<number>(() => {
    let result: number = 0;
    let operationChainLength = this.operationChain().length;

    if (operationChainLength) {
      result = this.operationChain()[0] as number;
    }

    for (let i = 1; i < operationChainLength - 1; i += 2) {
      const operator: Operator = this.operationChain()[i] as Operator;
      const nextOperand: number = Number(this.operationChain()[i + 1]);

      if (nextOperand && operator) {
        switch (operator) {
          case '+':
            result += nextOperand;
            break;
          case '-':
            result -= nextOperand;
            break;
          case 'x':
            result *= nextOperand;
            break;
          case '÷':
            result /= nextOperand;
            break;
        }
      }
    }

    return result;
  });

  operandChanged: boolean = false;

  constructor() { }

  setOperand(newValue: string): void {
    this.operand.update((value) => {
      if (value === '0' && newValue !== '.') {
        return newValue;
      }

      return value + newValue;
    });

    this.operandChanged = true;
  }

  setOperator(newValue: Operator): void {
    if (this.operandChanged) {
      this.operationChain.update((value) => {
        value.push(Number.parseFloat(this.operand()));
        value.push(newValue);
        return value;
      });
      this.operand.update(() => '0');
      this.operandChanged = false;
    } else {
      this.operationChain.update((value) => {
        value[value.length - 1] = newValue;
        return value;
      });
    }

    this.operator.update(() => newValue);
  }
}
