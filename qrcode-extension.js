class QRCodeExtension {
  getInfo() {
    return {
      id: 'qrcodeDisplay',
      name: 'QRコード表示',
      blocks: [
        {
          opcode: 'showQRCode',
          blockType: Scratch.BlockType.COMMAND,
          text: 'QRコードを表示 [TEXT]',
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://example.com'
            }
          }
        }
      ]
    };
  }

  async showQRCode(args, util) {
    const text = encodeURIComponent(args.TEXT);
    const imageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${text}`;

    const asset = await Scratch.vm.runtime.storage.loadWebImage(imageUrl);

    const costume = {
      name: 'QRコード',
      asset: asset,
      md5ext: asset.assetId + '.' + asset.dataFormat,
      dataFormat: asset.dataFormat
    };

    const target = util.target;
    target.sprite.costumes.push(costume);
    target.setCostume(target.sprite.costumes.length - 1);
  }
}

Scratch.extensions.register(new QRCodeExtension());
