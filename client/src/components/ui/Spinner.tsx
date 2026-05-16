import './Spinner.css';

interface SpinnerProps {
  fullPage?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner = ({ fullPage = false, className = '', size = 'md' }: SpinnerProps) => {
  const loaderClass = `loader ${size === 'lg' ? 'loader-lg' : ''} ${className}`.trim();

  const spinner = <span className={loaderClass} data-testid="spinner"></span>;

  if (fullPage) {
    return (
      <div className="spinner-container">
        {spinner}
      </div>
    );
  }

  return spinner;
};
