dim pub, prv, idx, msg

ICSSC_DEFAULT         = 0
CONNECTION_PUBLIC     = 0
CONNECTION_PRIVATE    = 1
CONNECTION_ALL        = 2

set NetSharingManager = Wscript.CreateObject("HNetCfg.HNetShare.1")

idx = 0
set Connections = NetSharingManager.EnumEveryConnection
for each Item in Connections
	idx = idx + 1
	set Connection = NetSharingManager.INetSharingConfigurationForINetConnection(Item)
	set Props = NetSharingManager.NetConnectionProps(Item)
	szMsg = CStr(idx) & "     " & Props.Name
	wscript.echo szMsg
	msg = msg & szMsg & vbcrlf
next
wscript.echo "------------------------------------------------------------------"
pub = cint(InputBox(msg & vbcrlf & "Which adapter is already connected to the Internet?", "Who shares?"))
prv = cint(InputBox(msg & vbcrlf & "Which adapter do you want to share the Internet with?", "Whom is shared with?"))
if pub = prv then
  wscript.echo "Error: Public can't be same as private!"
  box = MsgBox ("You can't share it with itself!", 0, "Error") 
  wscript.quit
end if

idx = 0
set Connections = NetSharingManager.EnumEveryConnection
for each Item in Connections
	idx = idx + 1
	set Connection = NetSharingManager.INetSharingConfigurationForINetConnection(Item)
	set Props = NetSharingManager.NetConnectionProps(Item)
	if idx = prv then Connection.EnableSharing CONNECTION_PRIVATE
	if idx = pub then Connection.EnableSharing CONNECTION_PUBLIC
next