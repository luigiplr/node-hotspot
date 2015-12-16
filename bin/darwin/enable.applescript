on run argv
	
	tell application "System Preferences"
		activate
		reveal (pane id "com.apple.preferences.sharing")
	end tell
	
	tell application "System Events"
		tell process "System Preferences"
			try
				select row 8 of table 1 of scroll area 1 of group 1 of window 1
				delay 1
				click pop up button 1 of group 1 of window 1
				click menu item 1 of menu 1 of pop up button 1 of group 1 of window 1
				if not value of checkbox of row 5 of table 1 of scroll area 2 of group 1 of window 1 as boolean then
					select row 5 of table 1 of scroll area 2 of group 1 of window 1
					click checkbox of row 5 of table 1 of scroll area 2 of group 1 of window 1
				end if
				
				click button 1 of group 1 of window 1
				set value of text field 1 of sheet 1 of window 1 to item 1 of argv
				set value of text field 2 of sheet 1 of window 1 to item 2 of argv
				set value of text field 3 of sheet 1 of window 1 to item 2 of argv
				click button 1 of sheet 1 of window 1
				delay 1
				
				if not value of checkbox of row 8 of table 1 of scroll area 1 of group 1 of window 1 as boolean then
					select row 8 of table 1 of scroll area 1 of group 1 of window 1
					click checkbox of row 8 of table 1 of scroll area 1 of group 1 of window 1
					click button 2 of sheet 1 of window 1
				end if
				delay 1
				
				tell application "System Preferences" to quit
				
				activate (display alert ("Internet sharing is already enabled.") giving up after 1)
				
			on error err
				activate
				display alert "Couldn't toggle Internet Sharing." message err as critical
				return false
			end try
			
		end tell
		
	end tell
end run