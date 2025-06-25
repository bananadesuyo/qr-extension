async showQRCode(args, util) {
  const text = encodeURIComponent(args.TEXT);
  const imageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${text}`;
  try {
    const runtime = (util && util.runtime) || (window.vm && window.vm.runtime);
    if (!runtime) {
      console.error('Runtimeが取得できませんでした');
      return;
    }
    const asset = await runtime.storage.loadWebImage(imageUrl);
    if (!asset || !asset.assetId || !asset.dataFormat) {
      console.error('画像のロードに失敗しました: asset情報が不完全です');
      return;
    }
    const costume = {
      name: 'QRコード',
      asset: asset,
      md5ext: asset.assetId + '.' + asset.dataFormat,
      dataFormat: asset.dataFormat
    };
    const target = util.target;
    if (!target) {
      console.error('targetが取得できませんでした');
      return;
    }
    target.sprite.costumes.push(costume);
    target.setCostume(target.sprite.costumes.length - 1);
  } catch (e) {
    console.error('QRコード読み込みエラー:', e);
  }
}
