from pathlib import Path

base = Path(__file__).resolve().parent.parent / 'public' / 'models'

(base / 'tier1_2b' / 'clinical_vocab_45k.json').write_text(
    '{"tokens":["metformin","lisinopril","atorvastatin","amoxicillin"]}',
    encoding='utf-8',
)
(base / 'tier1_2b' / 'medgemma_2b_q4_tensor_shard_01.bin').write_bytes(b'\x00\x01\x02\x03' * 32768)
(base / 'tier2_4b' / 'vision_encoder_q4.bin').write_bytes(b'\x10\x20\x30\x40' * 32768)
(base / 'tier2_4b' / 'medgemma_4b_clinical_tensor_shard_01.bin').write_bytes(b'\xAA\xBB\xCC\xDD' * 49152)
(base / 'tier3_9b_ollama' / 'medgemma-9b-clinical-q4_k_m.gguf').write_bytes(b'\x7F\x45\x4C\x46' * 49152)
print('created missing model artifacts')
