async function connect() {
  try {
    const filters = [
      //{ 'vendorId': 0x349e, 'productId': 0x0022 }, // token2
      //{ 'vendorId': 0x1050, 'productId': 0x0406 }, // yk nano c
      //{ 'vendorId': 0x1050, 'productId': 0x0120 }, // yubico u2f
      //{ 'vendorId': 0x27b8, 'productId': 0x01ed }, // blink
    ];
    let device = await navigator.usb.requestDevice({ 'filters': filters });
    console.log(`%c================ Device ${device.productName} ================`, "color: red");
    console.log(device);
    await device.open();
    console.log(`Device has ${device.configurations.length} configuration(s)`);

    await device.selectConfiguration(1);
    if (device.configuration === null) {
      console.log("selectConfiguration");
      await device.selectConfiguration(1);
    }

    console.log(`Using configuration: ${device.configuration.configurationValue}`);

    let interfaceNumber = -1;  // interface number of YubiKey CCID interface
    let endpointOut = -1;      // out endpoint ID of YubiKey CCID interface  
    let endpointIn = -1;       // in endpoint ID of YubiKey CCID interface  

    let configurationInterfaces = device.configuration.interfaces;
    console.log(`Configuration has ${configurationInterfaces.length} interfaces:`);
    //console.log("configurationInterfaces",configurationInterfaces);
    configurationInterfaces.forEach(element => {
      console.log(`%c---------------- USB Interface ${element.interfaceNumber} ----------------`, "color: green");
      //console.log("element",element);
      element.alternates.forEach(elementalt => {
        //console.log("elementalt",elementalt);
        switch (elementalt.interfaceClass) {
          case 0x03:
            console.log(`interfaceClass HID (${elementalt.interfaceClass})`);
            break;
          case 0x0b:
            console.log(`interfaceClass CCID (${elementalt.interfaceClass})`);
            interfaceNumber = element.interfaceNumber;
            console.log(`claimed: ${element.claimed}`);
            break;
          default:
            console.log(`interfaceClass: ${elementalt.interfaceClass}`);
        }
        elementalt.endpoints.forEach(elementendpoint => {
          //console.log("elementendpoint",elementendpoint);
          console.log(`- Endpoint ${elementendpoint.endpointNumber} ${elementendpoint.direction} (type ${elementendpoint.type}, ${elementendpoint.packetSize} bytes)`);
          if (elementalt.interfaceClass == 0x0b && elementendpoint.type == "bulk") {
            if (elementendpoint.direction == "in")
              endpointIn = elementendpoint.endpointNumber;
            if (elementendpoint.direction == "out")
              endpointOut = elementendpoint.endpointNumber;
          }
        })
      })
    })

    // YubiKey USB Interface #2: 
    // interfaceClass CCID (11)
    // - Endpoint 2 out (type bulk, 64 bytes)
    // - Endpoint 2 in (type bulk, 64 bytes)
    // - Endpoint 3 in (type interrupt, 8 bytes)

    // send 12 bytes over CCID interface: 00a40400 07 A0000005272001
    console.log(`sending interface #${interfaceNumber} endpoints in=${endpointOut} out=${endpointIn}`);

    let result = 0;
    result = await device.claimInterface(2) // Request exclusive control over interface #2.
    // NetworkError: Failed to execute 'claimInterface' on 'USBDevice': Unable to claim interface.

    console.log(result);
    // result = await device.controlTransferOut({ // HID class control transfer SET_REPORT) 
    //   requestType: 'class',
    //   recipient: 'interface',
    //   request: 0x09, // 0x22,
    //   value: 0x01,
    //   index: 0x00 // 0x02
    // }) // Ready to receive data
    // console.log(result);

    let aid = [0xA0, 0x00, 0x00, 0x05, 0x27, 0x20, 0x01]; // select OTP
    let select = [0x00, 0xa4, 0x04, 0x00, aid.length];
    let data = new Uint8Array(select.concat(aid));
    // console.log(data);
    device.transferOut(endpointOut, data);

    result = await device.transferIn(endpointIn, 64) // Waiting for 64 bytes of data from endpoint #2.
    const decoder = new TextDecoder();
    console.log('Received: ' + decoder.decode(result.data));


    await device.close();
  } catch (error) {
    console.log(error);
  };
}

document.querySelector('#list').addEventListener('click', connect);

// const l = document.getElementById('list') as HTMLInputElement;
