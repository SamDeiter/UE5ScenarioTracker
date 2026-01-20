import shutil
import os

src = 'C:/Users/Sam Deiter/.gemini/antigravity/brain/f7826610-6e62-4dba-b4e0-988f29bd70a9'
base = 'c:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/assets/generated'

# NaniteVSMIntegrationIssue
dst = os.path.join(base, 'NaniteVSMIntegrationIssue')
os.makedirs(dst, exist_ok=True)
nanite_files = [
    ('nanite_step1_1768315630223.png', 'step-1.png'),
    ('nanite_step3_1768315647787.png', 'step-3.png'),
    ('nanite_step7_1768315665509.png', 'step-7.png'),
    ('nanite_step10_1768315683490.png', 'step-10.png'),
    ('nanite_conclusion_1768315700286.png', 'conclusion.png'),
]
for s, d in nanite_files:
    shutil.copy(os.path.join(src, s), os.path.join(dst, d))
print(f'Copied {len(nanite_files)} NaniteVSMIntegrationIssue images')

# VirtualShadowMapArtifacts
dst = os.path.join(base, 'VirtualShadowMapArtifacts')
os.makedirs(dst, exist_ok=True)
vsm_files = [
    ('vsm_step1_1768315729996.png', 'step-1.png'),
    ('vsm_step3_1768315747874.png', 'step-3.png'),
    ('vsm_step5_1768315765154.png', 'step-5.png'),
    ('vsm_step8_1768315783057.png', 'step-8.png'),
    ('vsm_conclusion_1768315799523.png', 'conclusion.png'),
]
for s, d in vsm_files:
    shutil.copy(os.path.join(src, s), os.path.join(dst, d))
print(f'Copied {len(vsm_files)} VirtualShadowMapArtifacts images')

print('Done!')
