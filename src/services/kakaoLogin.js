import axios from "axios"

const kakaoHeader = {
  "Authorization": "86c0cbd9929497546cbd8746b0430cab7c2",
  "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
};

const getKakaoToken = async code => {
  try {
    const data = {
      grant_type: "authorization_code",
      client_id: "58f416aeb1757e4fc6a6a6f9477c88ef",
      redirect_uri: "http://localhost:8080/login",
      code: code
    };
    const queryString = Object.keys(data)
      .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
      .join("&");
    
    const result = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      queryString,
      { headers: kakaoHeader }
    );
    console.log(result);

    console.log("카카오 토큰", queryString);
    return result;
  } catch (e) {
    return e;
  }
};

const getKakaoUserInfo = async () => {
  let data = "";
  console.log(1);
  await window.Kakao.API.request({
    url: "/v2/user/me",
    success: function(response) {
      data = response;
    },
    fail: function(error) {
      console.log(error);
    }
  });
  console.log("카카오 계정 정보", data);
  return data;
};

export { getKakaoToken, getKakaoUserInfo };
