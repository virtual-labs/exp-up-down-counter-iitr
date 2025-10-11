

### (a) To Implement an Up/Down Counter Using Two General Purpose I/O Pins as Control Inputs.
1. Click on **View Circuit Diagram** to see how the 8051, 7-segment display, and control pins are connected in logic diagram and in block diagram.

2. Click on **View Assembly Code** to analyse the assembly code used for this experiment.

3. According to your analysis, write your code in the **Assembly Code Editor**.

4. Click on **Check Code** to verify your program against the given code.  
   **Note:**  
   - If correct → a success message will appear and **UP/DOWN** buttons will be enabled.  
   - If incorrect → you’ll be asked to review and correct your program.

5. (Optional) You can directly copy the code into the editor by clicking on **Use Code** in the View Assembly Code popup.

6. After validation, run the simulation. The 7-segment display will count in the range of 0 to 9.

7. Click **UP (P2.0)** to increment the value.

8. Click **DOWN (P2.1)** to decrement the value.

9. If both **UP** and **DOWN** are clicked simultaneously, the value will not change.

10. If you want to save your program, click **Download Code**. It will be stored as `your_code.asm`.

11. Click on the **RESET** button to stop the simulation, clear the editor, and reset everything to default.


### (b) To Implement an Up/Down Counter Using One Interrupt Pin as a Control Pin.


<br>

**1.** Click on **View Circuit Diagram** to see how the 8051, 7-segment display, and INT0 pin are connected in both the logic diagram and block diagram.

**2.** Click on **View Assembly Code** to analyze the assembly code used for this experiment.

**3.** Write your own code in the **Assembly Code Editor** based on your analysis.

**4.** Click on the **Check Code** button to verify your program against the given code.

**Note:**  
- If correct → a success message will appear and **Start Count** will be enabled.  
- If incorrect → you’ll be asked to review and correct your program.

**5.** (Optional) You can directly copy the given code into the editor by clicking **Use Code** in the View Assembly Code popup.

**6.** After validation, click on **Start Count** to run the simulation.

- The 7-segment display will begin counting from 0 to 9 (UP mode by default).

**7.** Click on **Toggle Direction (P3.2)** to simulate an interrupt.

- This will change the counting direction between UP and DOWN.

**8.** If you want to save your program, click on **Download Code**. It will be stored as `your_code.asm`.

**9.** Click on the **Reset** button to stop the simulation, clear the editor, and reset everything to default.
