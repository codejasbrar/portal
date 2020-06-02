import React from "react";

import styles from "./Footer.module.scss";

//Icons
import FbIcon from "../../icons/social/facebook.png";
import TwIcon from "../../icons/social/twitter.png";
import LinIcon from "../../icons/social/linkedin.png";
import YtIcon from "../../icons/social/youtube.png";
import InstaIcon from "../../icons/social/instagram.png";

type SocialIconPropsTypes = {
  href: string,
  icon: string,
  name: string
};

const socialLinks = [
  {
    name: 'Facebook',
    href: 'http://www.facebook.com/pages/InsideTracker-from-Segterra/271094716266705',
    icon: FbIcon
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/insidetracker',
    icon: TwIcon
  },
  {
    name: 'LinkedIn',
    href: 'http://www.linkedin.com/company/insidetracker/',
    icon: LinIcon
  },
  {
    name: 'YouTube',
    href: 'http://www.youtube.com/user/InsideTracker2?feature=watch',
    icon: YtIcon
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/InsideTracker',
    icon: InstaIcon
  }
];

const Footer = () => <footer className={styles.Footer}>
  <div className={`${styles.container} ${styles.FooterContainer}`}>
    <div className={styles.FooterCopyright}>
      <p className={styles.FooterText}>© 2009-2020 Segterra, Inc. All rights reserved. InsideTracker is a personalized
        nutrition model by&nbsp;Segterra. </p>
      <p className={styles.FooterText}>Technology protected by U.S. Patent 8762167 and other patent pending
        applications.</p>
    </div>
    <div className={styles.FooterContacts}>
      <div className={styles.Social}>
        <p className={styles.FooterLabel}>Subscribe</p>
        <div className={styles.SocialIcons}>
          {socialLinks.map((link: SocialIconPropsTypes) => <a target="_blank"
            rel="noopener noreferrer"
            href={link.href}
            className={styles.SocialLink}
            key={link.name}>
            <img className={styles.SocialIcon} src={link.icon} alt={link.name} />
          </a>)}
        </div>
      </div>
      <div className={styles.Contacts}>
        <p className={styles.FooterLabel}>Contact us</p>
        <a href="mailto:contactus@insidetracker.com" className={styles.ContactsText}>contactus@insidetracker.com</a>
        <a href="tel:88005132359" className={styles.ContactsText}>(800) 513-2359</a>
      </div>
    </div>
  </div>
</footer>;


export default Footer;