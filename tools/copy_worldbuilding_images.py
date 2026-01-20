import shutil
import os

src = 'C:/Users/Sam Deiter/.gemini/antigravity/brain/f7826610-6e62-4dba-b4e0-988f29bd70a9'
base = 'c:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/assets/generated'

# HLODNotGenerating
dst = os.path.join(base, 'HLODNotGenerating')
os.makedirs(dst, exist_ok=True)
hlod_files = [
    ('hlod_step1_1768314980615.png', 'step-1.png'),
    ('hlod_step4_1768315000765.png', 'step-4.png'),
    ('hlod_step7_1768315018201.png', 'step-7.png'),
    ('hlod_step10_1768315038933.png', 'step-10.png'),
    ('hlod_conclusion_1768315065426.png', 'conclusion.png'),
]
for s, d in hlod_files:
    shutil.copy(os.path.join(src, s), os.path.join(dst, d))
print(f'Copied {len(hlod_files)} HLODNotGenerating images')

# LandscapeStreamingHoles
dst = os.path.join(base, 'LandscapeStreamingHoles')
os.makedirs(dst, exist_ok=True)
landscape_files = [
    ('landscape_step1_1768315095693.png', 'step-1.png'),
    ('landscape_step4_1768315113835.png', 'step-4.png'),
    ('landscape_step8_1768315131687.png', 'step-8.png'),
    ('landscape_step12_1768315151490.png', 'step-12.png'),
    ('landscape_conclusion_1768315170437.png', 'conclusion.png'),
]
for s, d in landscape_files:
    shutil.copy(os.path.join(src, s), os.path.join(dst, d))
print(f'Copied {len(landscape_files)} LandscapeStreamingHoles images')

# LevelInstanceEditingBlocked
dst = os.path.join(base, 'LevelInstanceEditingBlocked')
os.makedirs(dst, exist_ok=True)
levelinst_files = [
    ('levelinst_step1_1768315202114.png', 'step-1.png'),
    ('levelinst_step3_1768315221040.png', 'step-3.png'),
    ('levelinst_step5_1768315240274.png', 'step-5.png'),
    ('levelinst_step8_1768315262907.png', 'step-8.png'),
    ('levelinst_conclusion_1768315282851.png', 'conclusion.png'),
]
for s, d in levelinst_files:
    shutil.copy(os.path.join(src, s), os.path.join(dst, d))
print(f'Copied {len(levelinst_files)} LevelInstanceEditingBlocked images')

# OneFilePerActorMergeConflict
dst = os.path.join(base, 'OneFilePerActorMergeConflict')
os.makedirs(dst, exist_ok=True)
ofpa_files = [
    ('ofpa_step1_1768315311795.png', 'step-1.png'),
    ('ofpa_step3_1768315333300.png', 'step-3.png'),
    ('ofpa_step5_1768315357951.png', 'step-5.png'),
    ('ofpa_step8_1768315380467.png', 'step-8.png'),
    ('ofpa_conclusion_1768315408642.png', 'conclusion.png'),
]
for s, d in ofpa_files:
    shutil.copy(os.path.join(src, s), os.path.join(dst, d))
print(f'Copied {len(ofpa_files)} OneFilePerActorMergeConflict images')

# PCGGraphNotGenerating
dst = os.path.join(base, 'PCGGraphNotGenerating')
os.makedirs(dst, exist_ok=True)
pcg_files = [
    ('pcg_step1_1768315449406.png', 'step-1.png'),
    ('pcg_step4_1768315473726.png', 'step-4.png'),
    ('pcg_step7_1768315498076.png', 'step-7.png'),
    ('pcg_step10_1768315512826.png', 'step-10.png'),
    ('pcg_conclusion_1768315532436.png', 'conclusion.png'),
]
for s, d in pcg_files:
    shutil.copy(os.path.join(src, s), os.path.join(dst, d))
print(f'Copied {len(pcg_files)} PCGGraphNotGenerating images')

print('Done!')
