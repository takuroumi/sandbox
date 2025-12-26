import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os
import glob

# filepath
FilePath='YourFolder/'

yearly_data = []

file_list = glob.glob(os.path.join(FilePath, "*.csv"))

print(f"{len(file_list)} files are found... ")

for file_path in file_list:
    try:
        df = pd.read_csv(file_path)
        
        import_df = df[df['Exp or Imp'] == 2].copy()
        
        if not import_df.empty:
            year = int(import_df['Year'].iloc[0])
            
            if import_df['Value-Year'].dtype == 'O':
                import_df['Value-Year'] = import_df['Value-Year'].str.astype(float)
            
            # 1,000 (1E3) Yen to Trillion (1E13) Yen
            total_value = import_df['Value-Year'].sum() / 1E9
            
            yearly_data.append({'Year': year, 'Total_Import_Value': total_value})
            print(f"Processed Year {year}: {total_value:.2f} Trillion Yen")
            
    except Exception as e:
        print(f"Error processing {os.path.basename(file_path)}: {e}")

# Sorting
result_df = pd.DataFrame(yearly_data).sort_values('Year')

# Graph
plt.figure(figsize=(12, 6))
sns.set_style("whitegrid")

plt.plot(result_df['Year'], result_df['Total_Import_Value'], marker='o', linestyle='-', color='firebrick', linewidth=2.5)

plt.title('Japanese Annual Energy Import Values [Trillion JPY]', fontsize=20, fontweight='bold')
plt.xlabel('Year', fontsize=16)
plt.ylabel('Gross Import Value [Trillion JPY]', fontsize=16)
plt.grid(True, linestyle='--', alpha=0.7)

plt.tick_params(axis='both', which='major', labelsize=16) # Number size 14

plt.xticks(result_df['Year'], rotation=45)

plt.tight_layout()
plt.show()