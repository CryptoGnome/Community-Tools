How to load PT_SpreadVisualiser indicator into TradingView.

At the bottom of the chart area, there are five tabs:
"Screener", "Text Notes", "Pine Editor", "Strategy Tester" and "Trading Panel".
Click the "Pine Editor" Tab to open it up.

There you will see three lines of text:

//@version=3
study("My Script")
plot(close)

Select all three lines and delete them to get a blank space.

If you dont see the three lines, load a blank indicator script. 
Towards the right you will see:
"Open", "New", "Save", "Add to Chart", "Publish SCript" and "Help"
Click "New" and at the top, select "New Blank Indicator" at the top of the list.
Then you will see the three lines mentioned above. Delete them to get a blank space to drop the PT_SpreadVisualiser text into.

Copy the text from PT_SpreadVisualiser and paste it into the blank Pine Script editor window.

Then click "Save", a dialog window will pop up asking you to name it, just click "Save".

Now click "Add to Chart" that is next to "Save".

#----------------------------------------------------------------------#

To alter the settings, click the indicator so you see dots appear on it, then Right Click it and select "Format". You can also click the cog icon next to the indicator name at the top left of the charting screen (there are five little grey icons, the second from the left is the "format settings" icon.
You will see the Format Setting window pop up, from here you can alter the values used in the indicator.

Using the EMA_1 (Slow) and EMA_2 (Fast) length values from your indicator.txt files, within the market condition folders from your config folder, input your desired slow and fast length values. (default is: slow length = 24, fast length = 3)

If using SMASPREAD as your strategy, then uncheck the "Use Exponential MA" checkbox.

Input your Buy value percentage. (default is -0.95)

Input in your trailing buy percentage. (default is 0.215)

As you alter the values in the format window, the indicator will change to reflect your changes.

Click "OK" when your done.

If you wish to save your changes for next time, at the bottom left of the format window is a drop down list that says "Default", click that and select "Save As Default"

If you wish to alter the colors and/or the line widths click the "Style" tab at the top of the format window and choose your preference.

#----------------------------------------------------------------------#

HOW TO INTERPRET:

The spread is a calculation between the fast and slow moving averages. (( FAST_EMA / SLOW_EMA ) -1 ) * 100
This value is plotted as the yellow line, which moves above and below a "zero" line. when it is above the zero line, the fast MA is above the slow MA and vise versa when it is below.

The thin white trailing line will turn blue when it has moved below the buy value you have set, indicating that trailing is active.
As long as the trailing line is below your buy value, then if the yellow spread line moves back above where the trailing line was (up to 9 periods ago), then it will signal that a buy condition would've been met within that candle, and it will display a green vertical bar.

