async function connectHID() {
  try {
    const filters = [
      { 'vendorId': 0x349e, 'productId': 0x0022 }, // token2
      { 'vendorId': 0x1050, 'productId': 0x0406 }, // yk nano c
      { 'vendorId': 0x1050, 'productId': 0x0120 }, // yubico u2f
      { 'vendorId': 0x27b8, 'productId': 0x01ed }, // blink
    ];


    const vendorId = 0x1050; // blink1 vid
    const productId = 0x0120;  // blink1 pid

    const device_list = await navigator.hid.getDevices();
    console.log(device_list)

    let device = device_list.find(d => d.vendorId === vendorId && d.productId === productId);
    console.log("device:", device);

    if (!device) {
      // this returns an array now
      let devices = await navigator.hid.requestDevice({
        filters: [] //filters, // [{ vendorId, productId }]
      });
      console.log("devices:", devices);
      device = devices[0];
    }

    if (!device.opened) {
      await device.open();
    }
    console.log("device opened:", device.productName);

    const reportId = 1;
    const data = Uint8Array.from([0x63, 255, 0, 0, 0x00, 0x10, 0x00, 0x00]); // example for blink device
    try {
      await device.sendFeatureReport(reportId, data);
    } catch (error) {
      console.error('sendFeatureReport: failed:', error);
    }

    await device.close();
  } catch (error) {
    console.log(error);
  };
}

document.querySelector('#listHID').addEventListener('click', connectHID);
