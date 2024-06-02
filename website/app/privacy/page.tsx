import Link from "next/link";

export default function Privacy() {
  return (
    <div className="flex flex-1 justify-center py-8 px-10 lg:py-24">
      <div className="w-full prose">
        <h1>Purdue Hoops Privacy Policy</h1>

        <p>Last Updated: May 30, 2024</p>

        <p>
          Your privacy is important to us. It is Purdue Hoops' policy to respect
          your privacy regarding any information we may collect from you through
          our app, Purdue Hoops.
        </p>

        <h2>Information We Collect</h2>

        <p>
          We only ask for personal information when we truly need it to provide
          a service to you. We collect it by fair and lawful means, with your
          knowledge and consent. We may collect the following types of
          information:
        </p>

        <ul>
          <li>
            Personal Information: Name, email address, profile information
            (e.g., height, position) that you provide voluntarily.
          </li>
          <li>
            Usage Data: Information about your interaction with our app, such as
            games attended, ratings given, and leaderboard rankings.
          </li>
          <li>
            Device Information: Information about your device, including device
            type, operating system, and IP address.
          </li>
        </ul>

        <h2>How We Use Your Information</h2>

        <p>
          We use the information we collect for various purposes, including:
        </p>

        <ul>
          <li>To provide and maintain the Purdue Hoops service.</li>
          <li>To personalize your experience and improve our app.</li>
          <li>To analyze usage trends and optimize performance.</li>
          <li>
            To communicate with you, including responding to inquiries and
            providing updates.
          </li>
          <li>
            To enforce our Terms of Service and protect the security of our app.
          </li>
        </ul>

        <h2>Sharing Your Information</h2>

        <p>
          We do not sell, trade, or otherwise transfer your personal information
          to outside parties. However, we may share your information with
          third-party service providers who assist us in operating our app,
          conducting our business, or servicing you.
        </p>

        <h2>Security</h2>

        <p>
          We are committed to protecting the security of your personal
          information. We implement appropriate technical and organizational
          measures to safeguard your data against unauthorized access,
          alteration, disclosure, or destruction.
        </p>

        <h2>Changes to This Privacy Policy</h2>

        <p>
          We reserve the right to update our Privacy Policy from time to time.
          Any changes will be posted on this page with an updated "Last Updated"
          date. We encourage you to review this Privacy Policy periodically for
          any changes.
        </p>

        <h2>Contact Us</h2>

        <p>
          If you have any questions or concerns about our Privacy Policy, please
          contact us at{" "}
          <a href="mailto:danielzach.business@gmail.com">
            danielzach.business@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
