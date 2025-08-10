#!/usr/bin/env python3
"""
Script to clean up the therapist's guide document by removing excessive whitespace
and formatting it properly for better RAG processing.
"""

import re
import os

def clean_text(text):
    """Clean up text by removing excessive whitespace and formatting issues"""
    
    # Remove excessive blank lines (more than 2 consecutive newlines)
    text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
    
    # Remove leading/trailing whitespace from each line
    lines = text.split('\n')
    cleaned_lines = []
    
    for line in lines:
        # Strip whitespace
        cleaned_line = line.strip()
        
        # Fix common OCR artifacts - using simple replacements
        replacements = {
            '0,5(&&': 'MIRECC',
            '7+(': 'THE',
            '%5,()': 'BRIEF',
            '&%7': 'CBT',
            '0$18$/': 'MANUAL',
            '7$%/(': 'TABLE',
            '&217(176': 'CONTENTS',
            '(66(17,$/': 'ESSENTIAL',
            '36<&+27+(5$3<': 'PSYCHOTHERAPY',
            '6.,/6': 'SKILLS',
            '02\'8/(': 'MODULE',
            '723,&': 'TOPIC',
            '8VLQJ': 'Using',
            '6XSHUYLVLRQ': 'Supervision',
            '5()(5(1&(6': 'REFERENCES',
            '68**(67(': 'SUGGESTED',
            '6833/(0(17$/': 'SUPPLEMENTAL',
            '5($',1*6': 'READINGS',
            '$33(1',;': 'APPENDIX',
            '3$7,(17': 'PATIENT',
            '+$1\'2876': 'HANDOUTS',
            '6$03/(': 'SAMPLE',
            '75($70(17': 'TREATMENT',
            '287/,1(6': 'OUTLINES'
        }
        
        # Apply replacements
        for old, new in replacements.items():
            cleaned_line = cleaned_line.replace(old, new)
        
        # Fix spacing issues - replace multiple spaces with single space
        cleaned_line = re.sub(r'\s+', ' ', cleaned_line)
        
        # Only add non-empty lines or preserve single empty lines for formatting
        if cleaned_line or (len(cleaned_lines) > 0 and cleaned_lines[-1] != ''):
            cleaned_lines.append(cleaned_line)
    
    # Join lines back together
    cleaned_text = '\n'.join(cleaned_lines)
    
    # Final cleanup - remove more than 2 consecutive empty lines
    cleaned_text = re.sub(r'\n\n\n+', '\n\n', cleaned_text)
    
    return cleaned_text.strip()

def main():
    """Main function to clean the document"""
    input_file = "/Users/mayankkatulkar/Desktop/MindCure/LiveKit-Llamaindex-Open-Template/src/data/therapists_guide_to_brief_cbtmanual_1754768208600.txt"
    output_file = "/Users/mayankkatulkar/Desktop/MindCure/LiveKit-Llamaindex-Open-Template/src/data/therapists_guide_to_brief_cbt_manual_cleaned.txt"
    
    print(f"Cleaning document: {input_file}")
    
    # Try to read the original file with different encodings
    original_text = None
    encodings_to_try = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
    
    for encoding in encodings_to_try:
        try:
            with open(input_file, 'r', encoding=encoding) as f:
                original_text = f.read()
            print(f"Successfully read file with {encoding} encoding")
            break
        except UnicodeDecodeError:
            print(f"Failed to read with {encoding} encoding, trying next...")
            continue
    
    if original_text is None:
        print("Could not read the file with any of the tried encodings")
        return
    
    print(f"Original file size: {len(original_text)} characters")
    
    # Clean the text
    cleaned_text = clean_text(original_text)
    
    print(f"Cleaned file size: {len(cleaned_text)} characters")
    print(f"Reduction: {len(original_text) - len(cleaned_text)} characters")
    
    # Write the cleaned text to a new file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(cleaned_text)
    
    print(f"Cleaned document saved to: {output_file}")
    
    # Remove the original file with the messy name
    try:
        os.remove(input_file)
        print(f"Removed original file: {input_file}")
    except Exception as e:
        print(f"Could not remove original file: {e}")

if __name__ == "__main__":
    main()
