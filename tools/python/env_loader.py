"""
Environment variable loader for secure API key management.
Loads API keys from .env file to keep them out of version control.
"""
import os
from pathlib import Path


def load_env_file(env_path=None):
    """
    Load environment variables from .env file.
    
    Args:
        env_path: Optional path to .env file. If None, searches for .env in current and parent directories.
    """
    if env_path is None:
        # Search for .env in current directory and parent directories
        current = Path.cwd()
        for directory in [current] + list(current.parents):
            potential_env = directory / '.env'
            if potential_env.exists():
                env_path = potential_env
                break
    
    if env_path is None:
        return False
    
    env_path = Path(env_path)
    if not env_path.exists():
        return False
    
    # Read and parse .env file
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            # Skip comments and empty lines
            if not line or line.startswith('#'):
                continue
            # Parse KEY=VALUE
            if '=' in line:
                key, value = line.split('=', 1)
                key = key.strip()
                value = value.strip()
                # Remove quotes if present
                if value.startswith('"') and value.endswith('"'):
                    value = value[1:-1]
                elif value.startswith("'") and value.endswith("'"):
                    value = value[1:-1]
                # Set environment variable
                os.environ[key] = value
    
    return True


def get_api_key(env_var='GEMINI_API_KEY'):
    """
    Get API key from environment variables.
    Automatically loads from .env file if not already set.
    
    Args:
        env_var: Name of the environment variable containing the API key
        
    Returns:
        API key string or None if not found
        
    Raises:
        ValueError: If API key is not found in environment or .env file
    """
    # First check if already in environment
    api_key = os.getenv(env_var)
    
    # If not found, try loading from .env file
    if not api_key:
        load_env_file()
        api_key = os.getenv(env_var)
    
    # If still not found, raise error
    if not api_key:
        raise ValueError(
            f"{env_var} not found. Please either:\n"
            f"1. Set environment variable: set {env_var}=your-api-key\n"
            f"2. Create a .env file in the project root with: {env_var}=your-api-key"
        )
    
    return api_key


# Convenience function
def get_gemini_key():
    """Get Gemini API key from environment."""
    return get_api_key('GEMINI_API_KEY')
