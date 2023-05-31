export const resizeImgService = async (
  currentHeight: number,
  currentWidth: number
) => {
  try {
    const orientation = currentHeight > currentWidth ? "portrait" : "landscape";
    const ratioMin = orientation === "portrait" ? 1.25 / 1 : 1.33 / 1;
    const ratioMax = orientation === "portrait" ? 1.25 / 1 : 1.33 / 1;
    const minWidth = 320;
    const maxWidth = 1080;
    let currentRatio = currentHeight / currentWidth;
    let nTry = 0;
    let end = new Date();

    end.setSeconds(end.getSeconds() + 5);

    while (
      (currentHeight / currentWidth < ratioMin ||
        currentHeight / currentWidth > ratioMax) &&
      new Date().getTime() < end.getTime()
    ) {
      nTry = nTry + 1;
      // console.log(nTry);

      if (currentRatio < ratioMin) {
        if (currentWidth >= minWidth && currentWidth < maxWidth) {
          // we increase the height and decrease the width proportionally to the height to get the right ratio
          currentHeight = currentHeight + 1;
          currentWidth = currentWidth - 1;
        } else if (currentRatio < ratioMin && currentWidth === maxWidth) {
          // we increase the height to get the right ratio
          currentHeight = currentHeight + 1;
        }
        currentRatio = currentHeight / currentWidth;
      } else if (currentRatio > ratioMax) {
        if (currentWidth >= minWidth && currentWidth < maxWidth) {
          // we decrease the height and increase the width proportionally to the height to get the right ratio
          currentHeight = currentHeight - 1;
          currentWidth = currentWidth + 1;
        } else if (currentRatio > ratioMax && currentWidth === maxWidth) {
          // we decrease the height to get the right ratio
          currentHeight = currentHeight - 1;
        }
      }
    }

    const now = new Date().getTime();
    if (
      now > end.getTime() &&
      (currentRatio < ratioMin || currentRatio > ratioMax)
    )
      throw new Error("The image ratio is not correct");

    return { height: currentHeight, width: currentWidth };
  } catch (error: any) {
    throw new Error(error);
  }
};
