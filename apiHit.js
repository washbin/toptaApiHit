const box = {
	// All the challenge solution codes go here
}


const COOKIE = "PHPSESSID=0467849501c0b3340f034aa404f2f357";
const USERNAME = "Ashbin Wosti";
const COUNTRY = "NP";

const solveIt = (responseData, url, entryKey) => {
  const { tests_json } = responseData.nextTask;
  for (const [key, value] of Object.entries(tests_json)) {
    tests_json[key] = value.result ??
      box[responseData.nextTask.slug](...value.args);
  }

  const body = new FormData();
  body.append("attempt_id", responseData.attemptId);
  body.append("entry_key", entryKey);
  body.append("tests_json", JSON.stringify(tests_json));
  body.append("code", "d");

  fetch(url, {
    method: "POST",
    body: body,
  })
    .then((res) => res.json())
    .then((response) => {
      const { data } = response;
      if (data.isChallengeEntryFinished) {
        console.log(data);
        return;
      } else {
        solveIt(data, url, entryKey);
      }
    })
    .catch((err) => console.log(err));
};

const startSolving = () => {
  const body = new FormData();
  body.append("challengeSlug", "toptal-js-2021");
  body.append("email", "");
  body.append("leaderboardName", USERNAME);
  body.append("isConfirmedToBeContacted", 1);
  body.append("isTermsAndConditionsChecked", 1);
  body.append("countryAlpha2", COUNTRY);

  fetch("https://speedcoding.toptal.com/webappApi/entry?ch=29&acc=2988", {
    headers: {
      Cookie: COOKIE,
    },
    method: "POST",
    body: body,
  })
    .then((res) => res.json())
    .then((response) => {
      const { data } = response;
      solveIt(
        data,
        `https://speedcoding.toptal.com/webappApi/entry/${data.entry.id}/attemptTask`,
        data.entry.entry_key,
      );
    })
    .catch((err) => console.log(err));
};

startSolving();
