"""
Filter models to only show best options for JSON generation.
"""

path = 'api_server.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the model filtering section
old_filter = '''            # Only include models suitable for text generation
            # Exclude: embedding, vision-only, image, audio, code-specific
            excluded_keywords = ['embedding', 'aqa', 'imagen', 'veo', 'learnlm', 'thinking']
            preferred_order = ['2.5-flash', '2.5-pro', '2.0-flash', '1.5-flash', '1.5-pro']'''

new_filter = '''            # Only include the best models for JSON text generation
            # Keep only: stable Flash and Pro models (no preview, experimental, TTS, lite, image)
            excluded_keywords = ['embedding', 'aqa', 'imagen', 'veo', 'learnlm', 'thinking', 
                                'tts', 'image', 'lite', 'banana', 'experimental', 'preview', '001']
            preferred_order = ['2.5-flash', '2.5-pro', '2.0-flash', '1.5-pro', '1.5-flash']'''

content = content.replace(old_filter, new_filter)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated! Now only showing stable Flash and Pro models.')
