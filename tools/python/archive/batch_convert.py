"""
Batch Scenario Converter
Processes multiple scenarios from raw_data.json efficiently
Groups by category for token savings
"""

import json
import os
import sys
from pathlib import Path
from scenario_generator import ScenarioGenerator

class BatchProcessor:
    def __init__(self, api_key, raw_data_path, output_dir, templates_path=None):
        """Initialize batch processor"""
        self.generator = ScenarioGenerator(api_key, templates_path)
        self.raw_data_path = Path(raw_data_path)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Load raw data
        with open(self.raw_data_path, 'r', encoding='utf-8') as f:
            self.raw_data = json.load(f)
        
        self.results = {
            'success': [],
            'failed': [],
            'total_tokens': 0
        }
    
    def group_by_category(self):
        """Group scenarios by category for batch processing"""
        groups = {}
        for item in self.raw_data:
            category = item['scenario']['focus_area']
            if category not in groups:
                groups[category] = []
            groups[category].append(item)
        return groups
    
    def process_all(self, batch_size=1):
        """
        Process all scenarios
        batch_size: Number of scenarios to process in one go (1 for now, can expand)
        """
        print("=" * 80)
        print("🚀 BATCH SCENARIO GENERATOR")
        print("=" * 80)
        print(f"\n📂 Input: {self.raw_data_path}")
        print(f"📂 Output: {self.output_dir}")
        print(f"📊 Total scenarios: {len(self.raw_data)}")
        
        # Group by category
        groups = self.group_by_category()
        print(f"\n📁 Categories found: {len(groups)}")
        for category, items in groups.items():
            print(f"  - {category}: {len(items)} scenarios")
        
        # Process each scenario
        print("\n" + "=" * 80)
        print("PROCESSING SCENARIOS")
        print("=" * 80)
        
        for i, raw_scenario in enumerate(self.raw_data, 1):
            scenario_id = raw_scenario['scenario']['scenario_id']
            output_path = self.output_dir / f"{scenario_id}.js"
            
            print(f"\n[{i}/{len(self.raw_data)}] Processing: {scenario_id}")
            print("-" * 80)
            
            try:
                # Check if already exists
                if output_path.exists():
                    print(f"⚠️  File already exists: {output_path}")
                    response = input("Overwrite? (y/n): ").strip().lower()
                    if response != 'y':
                        print("⏭️  Skipped")
                        continue
                
                # Generate scenario
                scenario = self.generator.generate_full_scenario(raw_scenario)
                
                # Validate
                if self.generator.validate_scenario(scenario):
                    # Save
                    self.generator.save_scenario_js(scenario, output_path)
                    self.results['success'].append(scenario_id)
                    print(f"✅ Success: {scenario_id}")
                else:
                    self.results['failed'].append({
                        'id': scenario_id,
                        'reason': 'Validation failed'
                    })
                    print(f"❌ Failed: {scenario_id} (validation)")
            
            except Exception as e:
                self.results['failed'].append({
                    'id': scenario_id,
                    'reason': str(e)
                })
                print(f"❌ Failed: {scenario_id}")
                print(f"   Error: {e}")
        
        # Update total tokens
        self.results['total_tokens'] = self.generator.token_count
        
        # Print summary
        self.print_summary()
    
    def process_range(self, start_idx, end_idx):
        """Process a specific range of scenarios (0-indexed)"""
        print(f"\n🎯 Processing scenarios {start_idx} to {end_idx}")
        
        subset = self.raw_data[start_idx:end_idx]
        original_data = self.raw_data
        self.raw_data = subset
        
        self.process_all()
        
        self.raw_data = original_data
    
    def process_by_category(self, category_name):
        """Process all scenarios in a specific category"""
        print(f"\n🎯 Processing category: {category_name}")
        
        subset = [item for item in self.raw_data 
                 if item['scenario']['focus_area'] == category_name]
        
        if not subset:
            print(f"❌ No scenarios found for category: {category_name}")
            return
        
        original_data = self.raw_data
        self.raw_data = subset
        
        self.process_all()
        
        self.raw_data = original_data
    
    def print_summary(self):
        """Print processing summary"""
        print("\n" + "=" * 80)
        print("📊 BATCH PROCESSING SUMMARY")
        print("=" * 80)
        
        print(f"\n✅ Successful: {len(self.results['success'])}")
        for scenario_id in self.results['success']:
            print(f"   - {scenario_id}")
        
        print(f"\n❌ Failed: {len(self.results['failed'])}")
        for item in self.results['failed']:
            print(f"   - {item['id']}: {item['reason']}")
        
        print(f"\n📊 Total tokens used: ~{self.results['total_tokens']}")
        
        if len(self.results['success']) > 0:
            avg_tokens = self.results['total_tokens'] / len(self.results['success'])
            print(f"📊 Average tokens per scenario: ~{avg_tokens:.0f}")
        
        # Cost estimation (Gemini 1.5 Flash pricing)
        # Input: $0.075 per 1M tokens, Output: $0.30 per 1M tokens
        # Rough estimate: assume 50/50 split
        estimated_cost = (self.results['total_tokens'] / 1_000_000) * 0.1875
        print(f"💰 Estimated cost: ${estimated_cost:.4f}")
        
        print("\n" + "=" * 80)


def main():
    """CLI interface for batch processor"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Batch convert scenarios using Gemini API')
    parser.add_argument('--api-key', help='Gemini API key (or set GEMINI_API_KEY env var)')
    parser.add_argument('--input', default='raw_data.json', help='Input JSON file')
    parser.add_argument('--output', default='scenarios', help='Output directory')
    parser.add_argument('--category', help='Process only this category')
    parser.add_argument('--range', help='Process range (e.g., "0-5")')
    parser.add_argument('--templates', help='Path to templates JSON')
    
    args = parser.parse_args()
    
    # Get API key
    api_key = args.api_key or os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ Error: GEMINI_API_KEY not set")
        print("Usage: python batch_convert.py --api-key YOUR_KEY")
        print("   or: set GEMINI_API_KEY environment variable")
        return 1
    
    # Resolve paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    
    input_path = project_root / args.input
    output_dir = project_root / args.output
    templates_path = args.templates
    
    if not input_path.exists():
        print(f"❌ Error: Input file not found: {input_path}")
        return 1
    
    # Initialize processor
    processor = BatchProcessor(api_key, input_path, output_dir, templates_path)
    
    # Process based on arguments
    if args.category:
        processor.process_by_category(args.category)
    elif args.range:
        start, end = map(int, args.range.split('-'))
        processor.process_range(start, end)
    else:
        processor.process_all()
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
