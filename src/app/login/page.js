"use client";
import { Form, Input, Row, Col } from "antd";
import "./index.scss";
import Button from "@/components/Button";
import { useForm } from "antd/es/form/Form";
import { useMutation } from "@tanstack/react-query";
import apiUser from "@/api/services/apiUser";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNotification } from "@/hooks/UseNotification";
import { useDispatch, useSelector } from "react-redux";
import { setDataUser, setToken } from "@/store-redux/slide/userSlide";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { openErrorNotification } = useNotification();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.userSlice);

  const { mutate: loginUser } = useMutation({
    mutationFn: (data) => apiUser.login(data),
    onSuccess: (data) => handleSuccesLogin(data?.data),
    onError: (err) => {
      setLoading(false);
      openErrorNotification(err);
    },
  });

  useEffect(() => {
    if (token) {
      router.push("/principal");
    }
  }, []);

  function handleSuccesLogin(data) {
    setLoading(false);
    if (!data.error) {
      dispatch(setToken(data?.items?.token));
      dispatch(setDataUser(data?.items?.dataUser));
      router.push("/principal");
    } else {
      openErrorNotification(data.message);
    }
  }

  const onLogin = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      loginUser(form.getFieldsValue());
    } catch (err) {}
  };

  return (
    <div className="bg-login">
      <div className="container-login">
        <div className="center-text-title-login">
          <h2 style={{ color: "white" }}>Admin pays</h2>
        </div>
        <div className="line-vertical"></div>
        <div className="content-form-login">
          <Form form={form} style={{ height: "100%" }}>
            <div className="center-form-login">
              <div>
                <Col>
                  <Form.Item label="Usuario" name="username">
                    <Input />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="Contraseña" name="password">
                    <Input.Password />
                  </Form.Item>
                </Col>
                <Button
                  className="btn-login"
                  text={
                    loading ? (
                      <LoadingOutlined
                        style={{ fontSize: "1.5em", color: "black" }}
                      />
                    ) : (
                      "Iniciar sesion"
                    )
                  }
                  onClick={onLogin}
                />
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
