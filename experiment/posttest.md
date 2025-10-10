#### Please attempt the following questions

<br>
Q1. If both P1.0 and P1.1 are high at the same time in the Up/Down counter program, what will happen?<br>
a. Counter will increment<br>
b. Counter will decrement<br>
c. Counting stops<br>
d. Counter will reset<br>

<br>
Q2. What does the `MOV P1, #0FFH` instruction do?<br>
a. Sets P1 as output<br>
b. Clears P1<br>
c. Sets P1 as input<br>
d. Increments P1<br>

<br>
Q3. In the Up/Down counter code, what is the function of `MOV P2, A`?<br>
a. Reads input from P2<br>
b. Outputs the counter value to LEDs<br>
c. Resets the counter<br>
d. Increments the accumulator<br>

<br>
Q4. What happens when the counter reaches 0x10 and is incremented?<br>
a. It becomes 0x11<br>
b. It resets to 0x00<br>
c. It halts<br>
d. It overflows<br>

<br>
Q5. What is the purpose of the `DJNZ` instruction in the delay subroutine?<br>
a. Jump if zero<br>
b. Decrease and jump if not zero<br>
c. Delay until input<br>
d. Divide by zero<br>

<br>
Q6. What is the role of the INT0 pin (P3.2) in this experiment?<br>
a. To start the counter<br>
b. To reset the counter<br>
c. To toggle the counting direction (UP/DOWN)<br>
d. To display output on 7-segment<br>

<br>
Q7. In the assembly program, what does the instruction **SETB IT0** do?<br>
a. Enables timer interrupt<br>
b. Configures INT0 as edge-triggered<br>
c. Configures INT0 as level-triggered<br>
d. Enables serial communication<br>

<br>
Q8. Which port of the 8051 is used to send data to the 7-segment display in this experiment?<br>
a. P0<br>
b. P1<br>
c. P2<br>
d. P3<br>

<br>
Q9. What happens inside the ISR (Interrupt Service Routine) when INT0 is triggered?<br>
a. The counter resets to zero<br>
b. The counting speed is doubled<br>
c. The counting direction is reversed<br>
d. The display is refreshed<br>

<br>
Q10. If the counter is in UP mode and currently at 9, what will be the next value displayed?<br>
a. 10<br>
b. 0<br>
c. 8<br>
d. It will stop<br>
