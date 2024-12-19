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
      await device.open();

      if (device.configuration === null) {
        console.log("selectConfiguration");
        await device.selectConfiguration(1);
      }

      let configurationInterfaces = device.configuration.interfaces;
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
              break;
            default:
              console.log(`interfaceClass: ${elementalt.interfaceClass}`);
          }
          elementalt.endpoints.forEach(elementendpoint => {
            //console.log("elementendpoint",elementendpoint);
            console.log(`- Endpoint ${elementendpoint.endpointNumber} ${elementendpoint.direction} (type ${elementendpoint.type}, ${elementendpoint.packetSize} bytes)`);
          })
        })
      })
      await device.close();
    } catch(error) {
      console.log(error);
    };
}

document.querySelector('#list').addEventListener('click', connect );

// const l = document.getElementById('list') as HTMLInputElement;
