/* eslint-disable @typescript-eslint/no-explicit-any */
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { Form } from "antd";
export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    navigate("/HomePage");
  };

  return (
    <div className="container-login">
      <div id="login-page " className="container open translate-x-[36vw]">
        {/* Title */}
        <h1 className="bida-title">Billiards Club</h1>
        {/* Login form */}
        <div className="form-set">
          <Form form={form} onFinish={onFinish}>
            <div className="mb-2">
              <Form.Item name="email" style={{ margin: 0 }}>
                <input
                  type="email"
                  placeholder="Email"
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                    padding: 7,
                    borderRadius: 5,
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>
            <div className="mb-2">
              <Form.Item name="password" style={{ margin: 0 }}>
                <input
                  type="password"
                  placeholder="Password"
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                    padding: 7,
                    borderRadius: 5,
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>
          </Form>

          {/* Login button */}
          <div
            onClick={() => form.submit()}
            className="w-full border-1 border-black rounded-3xl p-2 text-center hover:bg-[rgba(0,0,0,0.5)] hover:text-white transition duration-300 cursor-pointer uppercase font-bold"
          >
            Log in
          </div>
        </div>
        <div className="login-with">
          <div className="social">
            <ul className="icons">
              <li
                style={{
                  backgroundImage: `url("https://png.pngtree.com/png-clipart/20240204/original/pngtree-billiard-snooker-ball-number-13-vector-png-image_14235137.png)`,
                }}
                className="icon bg-cover bg-center"
              ></li>
              <li className="icon twitter">
                <div
                  className="link"
                  data-close="login-page"
                  data-open="twitter-page"
                >
                  <i className="fa fa-twitter" aria-hidden="true"></i>
                </div>
              </li>
              <li className="icon pinterest">
                <div
                  className="link"
                  data-close="login-page"
                  data-open="pinterest-page"
                >
                  <i className="fa fa-pinterest-p" aria-hidden="true"></i>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="other-links">
          <div>
            <div
              className="link"
              data-close="login-page"
              data-open="new-account-page"
            >
              Don’t have an Account?
            </div>
          </div>
          <div>
            <div
              className="link"
              data-close="login-page"
              data-open="forgot-pass-page"
            >
              Forgot your password?
            </div>
          </div>
        </div>
      </div>

      <div id="facebook-page" className="container close">
        <div className="close-button">
          <div
            className="link"
            data-close="facebook-page"
            data-open="login-page"
          >
            <i className="fa fa-close" aria-hidden="true"></i>
          </div>
        </div>
        <h1>Facebook</h1>
        <div className="form-set">
          <div className="form-group">
            <label className="form-label">User Name</label>
            <input type="text" className="form-control" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" />
          </div>
          <button className="btn">Log in</button>
        </div>
      </div>

      <div id="twitter-page" className="container close">
        <div className="close-button">
          <div
            className="link"
            data-close="twitter-page"
            data-open="login-page"
          >
            <i className="fa fa-close" aria-hidden="true"></i>
          </div>
        </div>
        <h1>Twitter</h1>
        <div className="form-set">
          <div className="form-group">
            <label className="form-label">User Name</label>
            <input type="text" className="form-control" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" />
          </div>
          <button className="btn">Log in</button>
        </div>
      </div>

      <div id="pinterest-page" className="container close">
        <div className="close-button">
          <div
            className="link"
            data-close="pinterest-page"
            data-open="login-page"
          >
            <i className="fa fa-close" aria-hidden="true"></i>
          </div>
        </div>
        <h1>Pinterest</h1>
        <div className="form-set">
          <div className="form-group">
            <label className="form-label">User Name</label>
            <input type="text" className="form-control" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" />
          </div>
          <button className="btn">Log in</button>
        </div>
      </div>

      <div id="new-account-page" className="container close">
        <div className="close-button">
          <div
            className="link"
            data-close="new-account-page"
            data-open="login-page"
          >
            <i className="fa fa-close" aria-hidden="true"></i>
          </div>
        </div>
        <h1>New Account</h1>
        <div className="form-set">
          <div className="form-group">
            <label className="form-label">User Name</label>
            <input type="text" className="form-control" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" />
          </div>
          <div className="form-group">
            <label className="form-label">Password again</label>
            <input type="password" className="form-control" />
          </div>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input type="text" className="form-control" />
          </div>
          <button className="btn">Create Account</button>
        </div>
      </div>

      <div id="forgot-pass-page" className="container close">
        <div className="close-button">
          <div
            className="link"
            data-close="forgot-pass-page"
            data-open="login-page"
          >
            <i className="fa fa-close" aria-hidden="true"></i>
          </div>
        </div>
        <h1>Forgot password?</h1>
        <div className="form-set">
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input type="text" className="form-control" />
          </div>
          <button className="btn">Send</button>
        </div>
      </div>
    </div>
  );
}
