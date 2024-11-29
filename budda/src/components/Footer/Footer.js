import "./Footer.css";
import giticon from "../../asset/img/github-mark.png";
import instagram from "../../asset/img/instagram.png";

function Footer() {
  return (
    <div className="wrrapFooter">
      <div className="footerLeft">
        <p>© 2024 BUUDA All rights reserved.</p>
        <p>123 Dongdaero, Gyeongju, Gyeongbuk, 780-714, Dongguk university </p>
        <p>Email : ohhunmi24@gmail.com</p>
        <p>Email : mmk622@naver.com</p>
      </div>
      <div className="footerRight">
        <div className="kyh">
          김영호
          <div>
            <a
              className="href"
              href="https://github.com/kimyoungho010311?tab=repositories"
            >
              <img className="giticon" src={giticon} alt="github" />
            </a>
            <a
              className="href"
              href="https://www.instagram.com/yoxnxhx?igsh=dGw1c2xsYnN4dThq&utm_source=qr"
            >
              <img className="instagram" src={instagram} alt="김영호"></img>
            </a>
          </div>
        </div>
        <div className="mmk">
          문민규
          <div>
            <a className="href" href="https://github.com/mmk622">
              <img className="giticon" src={giticon} alt="github" />
            </a>
            <a
              className="href"
              href="https://www.instagram.com/door_pushed_gyu?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            >
              <img className="instagram" src={instagram} alt="문민규"></img>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
