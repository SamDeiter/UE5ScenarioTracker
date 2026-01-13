import shutil
import os

src = 'C:/Users/Sam Deiter/.gemini/antigravity/brain/f7826610-6e62-4dba-b4e0-988f29bd70a9'
base = 'c:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/assets/generated'

# NiagaraGPUSimulationFallback
dst = os.path.join(base, 'NiagaraGPUSimulationFallback')
os.makedirs(dst, exist_ok=True)
gpu_files = [
    ('gpu_step1_1768314230580.png', 'step-1.png'),
    ('gpu_step2_1768314249452.png', 'step-2.png'),
    ('gpu_step3_1768314266983.png', 'step-3.png'),
    ('gpu_step7_1768314285007.png', 'step-7.png'),
    ('gpu_step9_1768314304353.png', 'step-9.png'),
    ('gpu_step10_1768314319324.png', 'step-10.png'),
    ('gpu_step11_1768314335298.png', 'step-11.png'),
    ('gpu_step12_1768314354099.png', 'step-12.png'),
    ('gpu_conclusion_1768314376016.png', 'conclusion.png'),
]
for s, d in gpu_files:
    shutil.copy(os.path.join(src, s), os.path.join(dst, d))
print(f'Copied {len(gpu_files)} NiagaraGPUSimulationFallback images')

# NiagaraRibbonTrailGaps
dst = os.path.join(base, 'NiagaraRibbonTrailGaps')
os.makedirs(dst, exist_ok=True)
ribbon_files = [
    ('ribbon_step1_1768314418241.png', 'step-1.png'),
    ('ribbon_step2_1768314438568.png', 'step-2.png'),
    ('ribbon_step3_1768314459580.png', 'step-3.png'),
    ('ribbon_step5_1768314477207.png', 'step-5.png'),
    ('ribbon_step7_1768314493940.png', 'step-7.png'),
    ('ribbon_step9_1768314513025.png', 'step-9.png'),
    ('ribbon_step11_1768314528912.png', 'step-11.png'),
    ('ribbon_step13_1768314543185.png', 'step-13.png'),
    ('ribbon_step15_1768314559599.png', 'step-15.png'),
    ('ribbon_conclusion_1768314574239.png', 'conclusion.png'),
]
for s, d in ribbon_files:
    shutil.copy(os.path.join(src, s), os.path.join(dst, d))
print(f'Copied {len(ribbon_files)} NiagaraRibbonTrailGaps images')

# SequencerAudioSyncDrift
dst = os.path.join(base, 'SequencerAudioSyncDrift')
os.makedirs(dst, exist_ok=True)
audio_files = [
    ('audio_step1_1768314608564.png', 'step-1.png'),
    ('audio_step2_1768314625162.png', 'step-2.png'),
    ('audio_step5_1768314642184.png', 'step-5.png'),
    ('audio_step7_1768314658233.png', 'step-7.png'),
    ('audio_step8_1768314678498.png', 'step-8.png'),
    ('audio_step10_1768314696962.png', 'step-10.png'),
    ('audio_step12_1768314719895.png', 'step-12.png'),
    ('audio_conclusion_1768314740872.png', 'conclusion.png'),
]
for s, d in audio_files:
    shutil.copy(os.path.join(src, s), os.path.join(dst, d))
print(f'Copied {len(audio_files)} SequencerAudioSyncDrift images')

print('Done!')
