tell application "System Preferences"
	activate
	reveal (pane id "com.apple.preferences.sharing")
end tell

tell application "System Events"
	tell process "System Preferences"
		try
			if value of checkbox of row 8 of table 1 of scroll area 1 of group 1 of window 1 as boolean then
				select row 8 of table 1 of scroll area 1 of group 1 of window 1
				click checkbox of row 8 of table 1 of scroll area 1 of group 1 of window 1
			end if
			delay 1
			
			tell application "System Preferences" to quit
			
			activate (display alert ("Internet sharing is already disabled.") giving up after 1)
			
		on error err
			activate
			display alert "Couldn't stop Internet Sharing." message err as critical
			return false
		end try
		
	end tell
	
end tell
