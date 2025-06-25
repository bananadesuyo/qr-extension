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

    try {
      let runtime = null;

      // 1. util.runtime があれば使う
      if (util && util.runtime) {
        runtime = util.runtime;
      }

      // 2. なければ少し待ってから window.vm.runtime を試す
      if (!runtime && window.vm && window.vm.runtime) {
        runtime = window.vm.runtime;
      }

      // 3. それでも取得できなければエラー
      if (!runtime) {
        console.error('❌ Runtimeが取得できませんでした');
        return;
      }

      const asset = await runtime.storage.loadWebImage(imageUrl);
      if (!asset || !asset.assetId || !asset.dataFormat) {
        console.error('❌ assetが不完全です');
        return;
      }

      const costume = {
        name: 'QRコード',
        asset: asset,
        md5ext: `${asset.assetId}.${asset.dataFormat}`,
        dataFormat: asset.dataFormat
      };

      const target = util.target;
      if (!target || !target.sprite) {
        console.error('❌ targetが取得できませんでした');
        return;
      }

      target.sprite.costumes.push(costume);
      target.setCostume(target.sprite.costumes.length - 1);
      console.log('✅ QRコード表示成功');
    } catch (e) {
      console.error('❌ QRコード読み込み中にエラー:', e);
    }
  }
}

Scratch.extensions.register(new QRCodeExtension());
