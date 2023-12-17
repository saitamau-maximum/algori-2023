const fs = require("fs");

const main = (...args) => {
  const [
    resultUrl,
    mainReportPath,
    dealerName,
    dealerCode,
    branchName,
    commitHash,
    githubToken,
    githubRepository,
    githubIssueNumber,
  ] = args[0]
  fetch(resultUrl)
    .then((res) => res.json())
    .then((json) => {
      const scores = json.scores;
      const mainScores = JSON.parse(fs.readFileSync(mainReportPath, "utf8"));
      const diffScores = Object.keys(scores).reduce((acc, player) => {
        const mainScore = mainScores[player];
        const score = scores[player];
        const diff = score - mainScore;
        const rate = (diff / mainScore) * 100 - 100;
        const rateDecorated = `${rate > 0 ? " +" : " "}${rate.toFixed(2)}`;
        return `${acc}| ${player} | ${score} | ${diff} | ${rateDecorated}% |\n`;
      }, "");
      const message =
        `Dealer name: ${dealerName}\n` +
        `Dealer code: ${dealerCode}\n` +
        `Branch name: ${branchName}\n` +
        `Commit hash: ${commitHash}\n\n` +
        "| Player | Score | Diff from main | Rate |\n" +
        "| --- | --- | --- | --- |\n" +
        `${diffScores}\n\n` +
        `[詳細な計測結果を見る](${resultUrl})`;
      const body = {
        body: message,
      };
      fetch(
        `https://api.github.com/repos/${githubRepository}/issues/${githubIssueNumber}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${githubToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
    });
};

main(process.argv.slice(2));
