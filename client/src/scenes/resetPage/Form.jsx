import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import PasswordChecklist from "react-password-checklist"


const otpSchema = yup.object().shape({
  email: yup.string().required("required"),
  otp: yup.string()
});

const resetSchema = yup.object().shape({
  password: yup.string().required("required"),
  confirm_password: yup.string().required("required")
});

const initialValuesReset = {
  password: "password",
  confirm_password: "password"
};

const initialValuesOTP = {
  email: "",
  otp: ""
};



const Form = () => {
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [otp,setOTP] = useState("");
  const [userId,setUserId] = useState("");
  const [incorrectOTP,setIncorrectOTP] = useState(false);
  const [isLoading,setLoading] = useState(false);
  const [errorMessage,setErrorMessage] = useState("");
  const [resetPassword,setResetPassword] = useState(false);
  const [resetError,setResetError] = useState("");
  const [isValid,setValid] = useState(true);
  const navigate = useNavigate();


  const verifyUser = async (values) => {
    try {
        setLoading(true);
        const response2 = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/users/useremail`,{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            }
        );
        const data = await response2.json();
        if(data._id) {
          setUserId(data._id);
          setResetPassword(true);
          setLoading(false);
        } else {
          setLoading(false);
            setErrorMessage("Email Not Registered.");
        }
    }
        catch (err) {
            console.log(err);
        }
        
  }

  const sendOTP = async (values, onSubmitProps) => {
    try {
        setLoading(true);
        const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/auth/otpverify`,{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            }
        );
        const res2 = await response.json();
        setOTP(res2.otp);
        setLoading(false);
    } catch(err) {
        console.log(err)
    }
  }

  const handleOTPSubmit = (values, onSubmitProps) => {
    if(otp) {
        if(Number(otp)===Number(values.otp)) {
            verifyUser(values);
            onSubmitProps.resetForm();
        } else {
            setIncorrectOTP(true);
        }
    }
    else {
        sendOTP(values);
    }
  }

  const resetPasswordFun = async (password) => {
    try {
      setLoading(true);
      const values = {
        userId: userId,
        password: password
      }
      const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/users/resetpassword`,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values)
        }
    );
    const res = await response.json();
    if(res.message) {
      setLoading(false);
      if(res.message==='Success') {
        navigate("/");
      } else {
        setResetError(res.message);
      }
      
    }
    } catch (err) {
      console.log(err);
    }
  }

  const handleResetSubmit = async(values, onSubmitProps) => {
    if(values.password === values.confirm_password && isValid) {
      await resetPasswordFun(values.password);
    } else {
      if(!isValid)  setResetError("Invalid Passwords.");
      else  setResetError("Passwords in both feilds should match.");
    }
  }

  if(resetPassword) {
    return (
      <>
      <Formik
        onSubmit={handleResetSubmit}
        initialValues={initialValuesReset}
        validationSchema={resetSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
             <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.confirm_password}
              name="confirm_password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
            {values.password&&values.confirm_password&&<PasswordChecklist
				    rules={["minLength","number","capital"]}
				    minLength={5}
            style={{width: "30rem"}}
            iconSize={10}
				    value={values.password}
            valueAgain={values.confirm_password}
				    onChange={(isValid) => {setValid(isValid)}}
			      />}
            </Box>

            <Box>
              <Button
                  fullWidth
                  type="submit"
                  sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    "&:hover": { color: palette.primary.main },
                  }}
                >
                  {isLoading?"Loading...":resetError?resetError:"Change Password"}
                </Button>
            </Box>
          </form>
        )}
      </Formik>
      </>
    );
  } else {
    return (
      <>
      <Formik
        onSubmit={handleOTPSubmit}
        initialValues={initialValuesOTP}
        validationSchema={otpSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
             <TextField
                label="Email"
                type="text"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.otp) && Boolean(errors.otp)}
                helperText={touched.otp && errors.otp}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="OTP"
                type="text"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.otp}
                name="otp"
                error={Boolean(touched.otp) && Boolean(errors.otp)}
                helperText={touched.otp && errors.otp}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box>
              <Button
                  fullWidth
                  type="submit"
                  sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    "&:hover": { color: palette.primary.main },
                  }}
                >
                  {errorMessage?errorMessage:isLoading?"Loading...":otp?(incorrectOTP?"INCORRECT OTP":"ENTER OTP"):("Generate OTP")}
                </Button>
            </Box>
          </form>
        )}
      </Formik>
      </>
    );
  }

   
};

export default Form;