# IWA Unrestricted USB Demo

A demo showing off Unrestricted USB using [Isolated Web Apps](https://github.com/WICG/isolated-web-apps/).
Adopted from the [getting started with Isolated Web Apps](https://chromeos.dev/en/tutorials/getting-started-with-isolated-web-apps) tutorial.

- install dependencies:

	npm install

- build IWA:

	npm run build

- Install `build/iwa-usb.swbn` via chrome://web-app-internals/

- Run "IWA Unrestricted USB Demo" app from your Chrome Apps folder (e.g. ~/Applications/Chrome Apps on macOS)

- Open Developer Console to view log messages


## Status

Currently, claiming interfaces on YubiKeys fail.

	NetworkError: Failed to execute 'claimInterface' on 'USBDevice': Unable to claim interface.

On possible reason could be that these interfaces are already claimed by the OS.

See also [here](https://stackoverflow.com/questions/67910528/tried-to-connect-a-device-to-web-via-webusb-but-failed-to-claim-interface-acc)

Accoring to the WebUSB API however, interfaces are not claimed (see log messages)

## Troubelshooting

- Use `chrome://usb-internals/` to inspect conected USB devices
