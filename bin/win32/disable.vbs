ICSSC_DEFAULT         = 0
CONNECTION_PUBLIC     = 0
CONNECTION_PRIVATE    = 1
CONNECTION_ALL        = 2

set NetSharingManager = Wscript.CreateObject("HNetCfg.HNetShare.1")

set Connections = NetSharingManager.EnumEveryConnection
for each Item in Connections
	set Connection = NetSharingManager.INetSharingConfigurationForINetConnection(Item)

	if Connection.SharingEnabled = True then
		Connection.EnableSharing CONNECTION_ALL
	end if
next