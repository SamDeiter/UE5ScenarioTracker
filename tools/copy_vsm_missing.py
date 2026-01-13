import shutil
import os

src = 'C:/Users/Sam Deiter/.gemini/antigravity/brain/f7826610-6e62-4dba-b4e0-988f29bd70a9'
dst = 'c:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/assets/generated/VirtualShadowMapArtifacts'

vsm_files = [
    ('vsm_step2_1768316662823.png', 'step-2.png'),
    ('vsm_step4_1768316679350.png', 'step-4.png'),
    ('vsm_step6_1768316701879.png', 'step-6.png'),
    ('vsm_step7_1768316719709.png', 'step-7.png'),
    ('vsm_step9_1768316736330.png', 'step-9.png'),
    ('vsm_step10_1768316764964.png', 'step-10.png'),
    ('vsm_step11_1768316781906.png', 'step-11.png'),
]
for s, d in vsm_files:
    src_path = os.path.join(src, s)
    dst_path = os.path.join(dst, d)
    if os.path.exists(src_path):
        shutil.copy(src_path, dst_path)
        print(f'Copied {d}')
    else:
        print(f'Missing {s}')

print('Done!')
