import Icon from "@ant-design/icons";

export const AlertIcon = (props) => {
  const { fill = "#DB2C34", width, height } = props;
  const icon = () => (
    <svg
      style={{ fill }}
      width={width ?? "21"}
      height={height ?? "21"}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      pointerEvents="none"
    >
      <path d="M10.5 0.5C8.52219 0.5 6.58879 1.08649 4.9443 2.1853C3.29981 3.28412 2.01809 4.8459 1.26121 6.67317C0.504333 8.50043 0.306299 10.5111 0.692152 12.4509C1.078 14.3907 2.03041 16.1725 3.42894 17.5711C4.82746 18.9696 6.60929 19.922 8.5491 20.3079C10.4889 20.6937 12.4996 20.4957 14.3268 19.7388C16.1541 18.9819 17.7159 17.7002 18.8147 16.0557C19.9135 14.4112 20.5 12.4778 20.5 10.5C20.5 9.18678 20.2413 7.88642 19.7388 6.67317C19.2363 5.45991 18.4997 4.35752 17.5711 3.42893C16.6425 2.50035 15.5401 1.76375 14.3268 1.2612C13.1136 0.758658 11.8132 0.5 10.5 0.5ZM10.5 18.5C8.91775 18.5 7.37104 18.0308 6.05544 17.1518C4.73985 16.2727 3.71447 15.0233 3.10897 13.5615C2.50347 12.0997 2.34504 10.4911 2.65372 8.93928C2.9624 7.38743 3.72433 5.96197 4.84315 4.84315C5.96197 3.72433 7.38743 2.9624 8.93928 2.65372C10.4911 2.34504 12.0997 2.50346 13.5615 3.10896C15.0233 3.71447 16.2727 4.73984 17.1518 6.05544C18.0308 7.37103 18.5 8.91775 18.5 10.5C18.5 12.6217 17.6572 14.6566 16.1569 16.1569C14.6566 17.6571 12.6217 18.5 10.5 18.5Z" />
      <path d="M10.5 15.5C11.0523 15.5 11.5 15.0523 11.5 14.5C11.5 13.9477 11.0523 13.5 10.5 13.5C9.94772 13.5 9.5 13.9477 9.5 14.5C9.5 15.0523 9.94772 15.5 10.5 15.5Z" />
      <path d="M10.5 5.5C10.2348 5.5 9.98043 5.60536 9.79289 5.79289C9.60536 5.98043 9.5 6.23478 9.5 6.5V11.5C9.5 11.7652 9.60536 12.0196 9.79289 12.2071C9.98043 12.3946 10.2348 12.5 10.5 12.5C10.7652 12.5 11.0196 12.3946 11.2071 12.2071C11.3946 12.0196 11.5 11.7652 11.5 11.5V6.5C11.5 6.23478 11.3946 5.98043 11.2071 5.79289C11.0196 5.60536 10.7652 5.5 10.5 5.5Z" />
    </svg>
  );
  return <Icon component={icon} {...props} />;
};