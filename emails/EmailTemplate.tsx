import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

export const ValidateEmail = ({name, link}: {name: any, link: string}) => {
    return (
        <Html>
          <Head />
          <Tailwind>
            <Body style={main}>
              <Container style={container}>
                <Section style={box}>
                  <div className="flex items-center w-full">
                    <Img
                      src={`https://res.cloudinary.com/dnlclcfck/image/upload/v1724330735/cmoe5428z1jpen8enhnq.png`}
                      height="51"
                      alt="Concord"
                    />
                    <h1 className="mx-4 text-orange-600">Concord</h1>
                  </div>
                  <Hr style={hr} />
                  <Text style={paragraph}>
                   Hi {name}!
                  </Text>
                  <Text style={paragraph}>
                  Your email address was just used to create an account on Concord. To start using the platform, please verify your email address by clicking the button below.
                  </Text>
                  <Button style={button} href={link}>
                   Verify email
                  </Button>
                  <Text style={paragraph}>
                  If you didn't create this account, you can safely ignore this email.
                  </Text>
                  <Text style={paragraph}>— The Concord team</Text>
                  <Hr style={hr} />
                </Section>
              </Container>
            </Body>
          </Tailwind>
        </Html>
      );
}

export const ResetPasswordEmail = ({name, link}: {name: any, link: string}) => {
    return (
      <Html>
          <Head />
          <Tailwind>
            <Body style={main}>
              <Container style={container}>
                <Section style={box}>
                  <div className="flex items-center w-full">
                    <Img
                      src={`https://res.cloudinary.com/dnlclcfck/image/upload/v1724330735/cmoe5428z1jpen8enhnq.png`}
                      height="51"
                      alt="Concord"
                    />
                    <h1 className="mx-4 text-orange-600">Concord</h1>
                  </div>
                  <Hr style={hr} />
                  <Text style={paragraph}>
                   Hi {name}!
                  </Text>
                  <Text style={paragraph}>
                  We got a request to reset your Concord password, to continue with  the reset click the button below.
                  </Text>
                  <Button style={button} href={link}>
                   Reset password
                  </Button>
                  <Text style={paragraph}>
                  If you didn't make this request, you can safely ignore this email.
                  </Text>
                  <Text style={paragraph}>— The Concord team</Text>
                  <Hr style={hr} />
                </Section>
              </Container>
            </Body>
          </Tailwind>
        </Html>
    )
}

const main = {
backgroundColor: "#f6f9fc",
fontFamily:
  '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
backgroundColor: "#ffffff",
margin: "0 auto",
padding: "20px 0 48px",
marginBottom: "64px",
};

const box = {
padding: "0 48px",
};

const hr = {
borderColor: "#e6ebf1",
margin: "20px 0",
};

const paragraph = {
color: "#525f7f",

fontSize: "16px",
lineHeight: "24px",
textAlign: "left" as const,
};

const anchor = {
color: "#556cd6",
};

const button = {
backgroundColor: "#FF6600",
borderRadius: "5px",
color: "#fff",
fontSize: "16px",
fontWeight: "bold",
textDecoration: "none",
textAlign: "center" as const,
display: "block",
width: "100%",
padding: "10px",
};

const footer = {
color: "#8898aa",
fontSize: "12px",
lineHeight: "16px",
};
