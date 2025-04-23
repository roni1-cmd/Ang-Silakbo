#!/bin/bash
# Neural Network Implementation in Bash
# This script creates a simple feedforward neural network with backpropagation
# It implements a network with configurable layers and neurons

set -e  # Exit on error

# =============== UTILITY FUNCTIONS ===============

# Function to print a message with timestamp
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to generate a random number between -1 and 1
random_weight() {
    echo "scale=6; (2*$RANDOM/32767)-1" | bc
}

# =============== MATRIX OPERATIONS ===============

# Function to create a matrix filled with random values
# Usage: create_matrix rows cols matrix_name
create_matrix() {
    local rows=$1
    local cols=$2
    local matrix_name=$3
    
    for ((i=0; i<rows; i++)); do
        for ((j=0; j<cols; j++)); do
            eval "${matrix_name}[$i,$j]=$(random_weight)"
        done
    done
}

# Function to initialize a matrix with zeros
# Usage: init_zeros rows cols matrix_name
init_zeros() {
    local rows=$1
    local cols=$2
    local matrix_name=$3
    
    for ((i=0; i<rows; i++)); do
        for ((j=0; j<cols; j++)); do
            eval "${matrix_name}[$i,$j]=0"
        done
    done
}

# Function to perform matrix multiplication C = A * B
# Usage: matrix_multiply A rows_A cols_A B cols_B C
matrix_multiply() {
    local A=$1
    local rows_A=$2
    local cols_A=$3
    local B=$4
    local cols_B=$5
    local C=$6
    
    for ((i=0; i<rows_A; i++)); do
        for ((j=0; j<cols_B; j++)); do
            local sum=0
            for ((k=0; k<cols_A; k++)); do
                local a_val=$(eval "echo \${${A}[$i,$k]}")
                local b_val=$(eval "echo \${${B}[$k,$j]}")
                sum=$(echo "scale=6; $sum + ($a_val * $b_val)" | bc)
            done
            eval "${C}[$i,$j]=$sum"
        done
    done
}

# Function to add bias to a matrix
# Usage: add_bias matrix rows cols bias
add_bias() {
    local matrix=$1
    local rows=$2
    local cols=$3
    local bias=$4
    
    for ((i=0; i<rows; i++)); do
        for ((j=0; j<cols; j++)); do
            local val=$(eval "echo \${${matrix}[$i,$j]}")
            local bias_val=$(eval "echo \${${bias}[$j]}")
            eval "${matrix}[$i,$j]=$(echo "scale=6; $val + $bias_val" | bc)"
        done
    done
}

# Function to transpose a matrix
# Usage: transpose_matrix A rows cols A_T
transpose_matrix() {
    local A=$1
    local rows=$2
    local cols=$3
    local A_T=$4
    
    for ((i=0; i<rows; i++)); do
        for ((j=0; j<cols; j++)); do
            local val=$(eval "echo \${${A}[$i,$j]}")
            eval "${A_T}[$j,$i]=$val"
        done
    done
}

# Function to element-wise multiply two matrices
# Usage: hadamard_product A B rows cols C
hadamard_product() {
    local A=$1
    local B=$2
    local rows=$3
    local cols=$4
    local C=$5
    
    for ((i=0; i<rows; i++)); do
        for ((j=0; j<cols; j++)); do
            local a_val=$(eval "echo \${${A}[$i,$j]}")
            local b_val=$(eval "echo \${${B}[$i,$j]}")
            eval "${C}[$i,$j]=$(echo "scale=6; $a_val * $b_val" | bc)"
        done
    done
}

# Function to subtract two matrices C = A - B
# Usage: matrix_subtract A B rows cols C
matrix_subtract() {
    local A=$1
    local B=$2
    local rows=$3
    local cols=$4
    local C=$5
    
    for ((i=0; i<rows; i++)); do
        for ((j=0; j<cols; j++)); do
            local a_val=$(eval "echo \${${A}[$i,$j]}")
            local b_val=$(eval "echo \${${B}[$i,$j]}")
            eval "${C}[$i,$j]=$(echo "scale=6; $a_val - $b_val" | bc)"
        done
    done
}

# Function to scale a matrix by a constant factor
# Usage: scale_matrix matrix rows cols factor
scale_matrix() {
    local matrix=$1
    local rows=$2
    local cols=$3
    local factor=$4
    
    for ((i=0; i<rows; i++)); do
        for ((j=0; j<cols; j++)); do
            local val=$(eval "echo \${${matrix}[$i,$j]}")
            eval "${matrix}[$i,$j]=$(echo "scale=6; $val * $factor" | bc)"
        done
    done
}

# =============== ACTIVATION FUNCTIONS ===============

# Sigmoid activation function
# Usage: apply_sigmoid matrix rows cols
apply_sigmoid() {
    local matrix=$1
    local rows=$2
    local cols=$3
    
    for ((i=0; i<rows; i++)); do
        for ((j=0; j<cols; j++)); do
            local val=$(eval "echo \${${matrix}[$i,$j]}")
            # Sigmoid function: 1 / (1 + e^(-x))
            eval "${matrix}[$i,$j]=$(echo "scale=6; 1 / (1 + e(- $val))" | bc -l)"
        done
    done
}

# Derivative of sigmoid function
# Usage: sigmoid_derivative matrix rows cols output_matrix
sigmoid_derivative() {
    local matrix=$1
    local rows=$2
    local cols=$3
    local output=$4
    
    for ((i=0; i<rows; i++)); do
        for ((j=0; j<cols; j++)); do
            local val=$(eval "echo \${${matrix}[$i,$j]}")
            # Derivative of sigmoid: sigmoid(x) * (1 - sigmoid(x))
            eval "${output}[$i,$j]=$(echo "scale=6; $val * (1 - $val)" | bc)"
        done
    done
}

# ReLU activation function
# Usage: apply_relu matrix rows cols
apply_relu() {
    local matrix=$1
    local rows=$2
    local cols=$3
    
    for ((i=0; i<rows; i++)); do
        for ((j=0; j<cols; j++)); do
            local val=$(eval "echo \${${matrix}[$i,$j]}")
            # ReLU function: max(0, x)
            if (( $(echo "$val < 0" | bc -l) )); then
                eval "${matrix}[$i,$j]=0"
            fi
        done
    done
}

# Derivative of ReLU function
# Usage: relu_derivative matrix rows cols output_matrix
relu_derivative() {
    local matrix=$1
    local rows=$2
    local cols=$3
    local output=$4
    
    for ((i=0; i<rows; i++)); do
        for ((j=0; j<cols; j++)); do
            local val=$(eval "echo \${${matrix}[$i,$j]}")
            # Derivative of ReLU: 1 if x > 0, 0 otherwise
            if (( $(echo "$val > 0" | bc -l) )); then
                eval "${output}[$i,$j]=1"
            else
                eval "${output}[$i,$j]=0"
            fi
        done
    done
}

# =============== LOSS FUNCTIONS ===============

# Mean Squared Error loss function
# Usage: mse_loss predictions targets
mse_loss() {
    local predictions=$1
    local targets=$2
    local samples=$3
    local features=$4
    
    local sum_error=0
    for ((i=0; i<samples; i++)); do
        for ((j=0; j<features; j++)); do
            local pred=$(eval "echo \${${predictions}[$i,$j]}")
            local target=$(eval "echo \${${targets}[$i,$j]}")
            local error=$(echo "scale=6; $pred - $target" | bc)
            sum_error=$(echo "scale=6; $sum_error + ($error * $error)" | bc)
        done
    done
    
    local total_elements=$(echo "$samples * $features" | bc)
    echo "scale=6; $sum_error / $total_elements" | bc
}

# =============== NEURAL NETWORK CLASS ===============

# Initialize the neural network structure
# Usage: init_network input_size hidden_size output_size
init_network() {
    input_size=$1
    hidden_size=$2
    output_size=$3
    
    log "Initializing neural network: input=$input_size, hidden=$hidden_size, output=$output_size"
    
    # Create weight matrices with random values
    create_matrix $input_size $hidden_size W1
    create_matrix $hidden_size $output_size W2
    
    # Create bias vectors
    for ((i=0; i<hidden_size; i++)); do
        b1[$i]=$(random_weight)
    done
    
    for ((i=0; i<output_size; i++)); do
        b2[$i]=$(random_weight)
    done
    
    log "Network initialized with random weights and biases"
}

# Forward pass through the neural network
# Usage: forward_pass X samples features
forward_pass() {
    local X=$1
    local samples=$2
    local features=$3
    
    # First layer: Z1 = X * W1 + b1
    matrix_multiply $X $samples $input_size W1 $hidden_size Z1
    
    # Add bias to first layer
    add_bias Z1 $samples $hidden_size b1
    
    # Apply activation function to get A1
    for ((i=0; i<samples; i++)); do
        for ((j=0; j<hidden_size; j++)); do
            A1[$i,$j]=${Z1[$i,$j]}
        done
    done
    apply_sigmoid A1 $samples $hidden_size
    
    # Second layer: Z2 = A1 * W2 + b2
    matrix_multiply A1 $samples $hidden_size W2 $output_size Z2
    
    # Add bias to second layer
    add_bias Z2 $samples $output_size b2
    
    # Apply activation function to get output
    for ((i=0; i<samples; i++)); do
        for ((j=0; j<output_size; j++)); do
            output[$i,$j]=${Z2[$i,$j]}
        done
    done
    apply_sigmoid output $samples $output_size
}

# Backward pass (backpropagation)
# Usage: backward_pass X y samples features
backward_pass() {
    local X=$1
    local y=$2
    local samples=$3
    local features=$4
    local learning_rate=0.1
    
    # Calculate output layer error (dZ2 = output - y)
    for ((i=0; i<samples; i++)); do
        for ((j=0; j<output_size; j++)); do
            local pred=${output[$i,$j]}
            local actual=$(eval "echo \${${y}[$i,$j]}")
            dZ2[$i,$j]=$(echo "scale=6; $pred - $actual" | bc)
        done
    done
    
    # Transpose A1 for matrix multiplication
    transpose_matrix A1 $samples $hidden_size A1_T
    
    # Calculate gradient of W2 (dW2 = A1_T * dZ2)
    matrix_multiply A1_T $hidden_size $samples dZ2 $output_size dW2
    scale_matrix dW2 $hidden_size $output_size $(echo "scale=6; 1 / $samples" | bc)
    
    # Calculate gradient of b2 (average of dZ2 across samples)
    for ((j=0; j<output_size; j++)); do
        local sum=0
        for ((i=0; i<samples; i++)); do
            sum=$(echo "scale=6; $sum + ${dZ2[$i,$j]}" | bc)
        done
        db2[$j]=$(echo "scale=6; $sum / $samples" | bc)
    done
    
    # Transpose W2 for matrix multiplication
    transpose_matrix W2 $hidden_size $output_size W2_T
    
    # Calculate hidden layer error (dZ1 = dZ2 * W2_T * sigmoid_derivative(A1))
    matrix_multiply dZ2 $samples $output_size W2_T $hidden_size dZ1_temp
    
    # Calculate sigmoid derivative of A1
    sigmoid_derivative A1 $samples $hidden_size dA1
    
    # Element-wise multiply to get dZ1
    hadamard_product dZ1_temp dA1 $samples $hidden_size dZ1
    
    # Transpose X for matrix multiplication
    transpose_matrix $X $samples $features X_T
    
    # Calculate gradient of W1 (dW1 = X_T * dZ1)
    matrix_multiply X_T $features $samples dZ1 $hidden_size dW1
    scale_matrix dW1 $features $hidden_size $(echo "scale=6; 1 / $samples" | bc)
    
    # Calculate gradient of b1 (average of dZ1 across samples)
    for ((j=0; j<hidden_size; j++)); do
        local sum=0
        for ((i=0; i<samples; i++)); do
            sum=$(echo "scale=6; $sum + ${dZ1[$i,$j]}" | bc)
        done
        db1[$j]=$(echo "scale=6; $sum / $samples" | bc)
    done
    
    # Update weights and biases
    # W1 = W1 - learning_rate * dW1
    for ((i=0; i<input_size; i++)); do
        for ((j=0; j<hidden_size; j++)); do
            W1[$i,$j]=$(echo "scale=6; ${W1[$i,$j]} - $learning_rate * ${dW1[$i,$j]}" | bc)
        done
    done
    
    # b1 = b1 - learning_rate * db1
    for ((i=0; i<hidden_size; i++)); do
        b1[$i]=$(echo "scale=6; ${b1[$i]} - $learning_rate * ${db1[$i]}" | bc)
    done
    
    # W2 = W2 - learning_rate * dW2
    for ((i=0; i<hidden_size; i++)); do
        for ((j=0; j<output_size; j++)); do
            W2[$i,$j]=$(echo "scale=6; ${W2[$i,$j]} - $learning_rate * ${dW2[$i,$j]}" | bc)
        done
    done
    
    # b2 = b2 - learning_rate * db2
    for ((i=0; i<output_size; i++)); do
        b2[$i]=$(echo "scale=6; ${b2[$i]} - $learning_rate * ${db2[$i]}" | bc)
    done
}

# Train the neural network
# Usage: train_network X y samples features epochs
train_network() {
    local X=$1
    local y=$2
    local samples=$3
    local features=$4
    local epochs=$5
    
    log "Starting training for $epochs epochs..."
    
    for ((epoch=1; epoch<=epochs; epoch++)); do
        # Forward pass
        forward_pass $X $samples $features
        
        # Calculate loss
        local loss=$(mse_loss output $y $samples $output_size)
        
        # Backward pass
        backward_pass $X $y $samples $features
        
        # Print progress every 10 epochs
        if ((epoch % 10 == 0)); then
            log "Epoch $epoch/$epochs, Loss: $loss"
        fi
    done
    
    log "Training completed."
}

# Predict using the trained network
# Usage: predict X samples features
predict() {
    local X=$1
    local samples=$2
    local features=$3
    
    log "Making predictions..."
    
    # Forward pass
    forward_pass $X $samples $features
    
    # Return the output
    for ((i=0; i<samples; i++)); do
        echo -n "Sample $i: "
        for ((j=0; j<output_size; j++)); do
            echo -n "${output[$i,$j]} "
        done
        echo ""
    done
}

# Save model weights to file
# Usage: save_model filename
save_model() {
    local filename=$1
    
    log "Saving model to $filename"
    
    # Create a new file
    > "$filename"
    
    # Save network architecture
    echo "ARCHITECTURE:$input_size:$hidden_size:$output_size" >> "$filename"
    
    # Save W1
    echo "W1:" >> "$filename"
    for ((i=0; i<input_size; i++)); do
        for ((j=0; j<hidden_size; j++)); do
            echo "[$i,$j]:${W1[$i,$j]}" >> "$filename"
        done
    done
    
    # Save b1
    echo "b1:" >> "$filename"
    for ((i=0; i<hidden_size; i++)); do
        echo "[$i]:${b1[$i]}" >> "$filename"
    done
    
    # Save W2
    echo "W2:" >> "$filename"
    for ((i=0; i<hidden_size; i++)); do
        for ((j=0; j<output_size; j++)); do
            echo "[$i,$j]:${W2[$i,$j]}" >> "$filename"
        done
    done
    
    # Save b2
    echo "b2:" >> "$filename"
    for ((i=0; i<output_size; i++)); do
        echo "[$i]:${b2[$i]}" >> "$filename"
    done
    
    log "Model saved successfully."
}

# Load model weights from file
# Usage: load_model filename
load_model() {
    local filename=$1
    
    log "Loading model from $filename"
    
    if [[ ! -f "$filename" ]]; then
        log "Error: Model file not found!"
        return 1
    fi
    
    # Read architecture
    local arch_line=$(grep "ARCHITECTURE:" "$filename")
    IFS=':' read -r _ input_size hidden_size output_size <<< "$arch_line"
    
    log "Loaded architecture: input=$input_size, hidden=$hidden_size, output=$output_size"
    
    # Load W1
    local in_w1=false
    while IFS= read -r line; do
        if [[ "$line" == "W1:" ]]; then
            in_w1=true
            continue
        elif [[ "$line" == "b1:" ]]; then
            in_w1=false
            continue
        fi
        
        if [[ "$in_w1" == true ]]; then
            IFS=':' read -r indices value <<< "$line"
            indices=${indices//[\[\]]/}
            IFS=',' read -r i j <<< "$indices"
            W1[$i,$j]=$value
        fi
    done < "$filename"
    
    # Load b1
    local in_b1=false
    while IFS= read -r line; do
        if [[ "$line" == "b1:" ]]; then
            in_b1=true
            continue
        elif [[ "$line" == "W2:" ]]; then
            in_b1=false
            continue
        fi
        
        if [[ "$in_b1" == true ]]; then
            IFS=':' read -r indices value <<< "$line"
            indices=${indices//[\[\]]/}
            b1[$indices]=$value
        fi
    done < "$filename"
    
    # Load W2
    local in_w2=false
    while IFS= read -r line; do
        if [[ "$line" == "W2:" ]]; then
            in_w2=true
            continue
        elif [[ "$line" == "b2:" ]]; then
            in_w2=false
            continue
        fi
        
        if [[ "$in_w2" == true ]]; then
            IFS=':' read -r indices value <<< "$line"
            indices=${indices//[\[\]]/}
            IFS=',' read -r i j <<< "$indices"
            W2[$i,$j]=$value
        fi
    done < "$filename"
    
    # Load b2
    local in_b2=false
    while IFS= read -r line; do
        if [[ "$line" == "b2:" ]]; then
            in_b2=true
            continue
        fi
        
        if [[ "$in_b2" == true ]]; then
            IFS=':' read -r indices value <<< "$line"
            indices=${indices//[\[\]]/}
            b2[$indices]=$value
        fi
    done < "$filename"
    
    log "Model loaded successfully."
}

# =============== DATA HANDLING ===============

# Function to load data from CSV file
# Usage: load_data filename X y has_header
load_data() {
    local filename=$1
    local X_var=$2
    local y_var=$3
    local has_header=$4
    
    log "Loading data from $filename"
    
    if [[ ! -f "$filename" ]]; then
        log "Error: Data file not found!"
        return 1
    fi
    
    # Skip header if necessary
    local start_line=0
    if [[ "$has_header" == "true" ]]; then
        start_line=1
    fi
    
    # Count number of rows and columns
    local total_lines=$(wc -l < "$filename")
    local num_samples=$((total_lines - start_line))
    local num_columns=$(head -1 "$filename" | tr ',' ' ' | wc -w)
    
    # Assuming the last column is the target
    local features=$((num_columns - 1))
    local outputs=1
    
    log "Detected $num_samples samples with $features features and $outputs outputs"
    
    # Read data
    local row=0
    tail -n +$((start_line + 1)) "$filename" | while IFS=',' read -ra values; do
        for ((col=0; col<features; col++)); do
            eval "${X_var}[$row,$col]=${values[$col]}"
        done
        
        # Assuming single output for simplicity
        eval "${y_var}[$row,0]=${values[$features]}"
        
        ((row++))
    done
    
    log "Data loaded successfully."
    return 0
}

# Function to normalize data
# Usage: normalize_data X samples features
normalize_data() {
    local X=$1
    local samples=$2
    local features=$3
    
    log "Normalizing data..."
    
    # Find min and max for each feature
    for ((j=0; j<features; j++)); do
        local min_val=$(eval "echo \${${X}[0,$j]}")
        local max_val=$min_val
        
        for ((i=1; i<samples; i++)); do
            local val=$(eval "echo \${${X}[$i,$j]}")
            
            if (( $(echo "$val < $min_val" | bc -l) )); then
                min_val=$val
            fi
            
            if (( $(echo "$val > $max_val" | bc -l) )); then
                max_val=$val
            fi
        done
        
        # Store min and max for later use (e.g., when normalizing test data)
        feature_min[$j]=$min_val
        feature_max[$j]=$max_val
        
        # Normalize each value
        for ((i=0; i<samples; i++)); do
            local val=$(eval "echo \${${X}[$i,$j]}")
            local range=$(echo "scale=6; $max_val - $min_val" | bc)
            
            # Handle case where min=max (all values are the same)
            if (( $(echo "$range == 0" | bc -l) )); then
                eval "${X}[$i,$j]=0.5"  # Set to middle of range
            else
                local norm_val=$(echo "scale=6; ($val - $min_val) / $range" | bc)
                eval "${X}[$i,$j]=$norm_val"
            fi
        done
    done
    
    log "Data normalization completed."
}

# =============== EXAMPLES AND DEMO ===============

# Example: XOR problem
xor_example() {
    log "Running XOR example..."
    
    # XOR data: input_1, input_2, output
    X[0,0]=0; X[0,1]=0; y[0,0]=0
    X[1,0]=0; X[1,1]=1; y[1,0]=1
    X[2,0]=1; X[2,1]=0; y[2,0]=1
    X[3,0]=1; X[3,1]=1; y[3,0]=0
    
    # Initialize network
    init_network 2 4 1
    
    # Train network
    train_network X y 4 2 1000
    
    # Make predictions
    log "Final predictions:"
    predict X 4 2
    
    # Save the model
    save_model "xor_model.txt"
}

# Example: Binary classification on a CSV file
csv_example() {
    if [[ $# -lt 1 ]]; then
        log "Usage: csv_example <csv_file> [has_header]"
        return 1
    fi
    
    local csv_file=$1
    local has_header=${2:-true}
    
    # Load data
    load_data "$csv_file" X y "$has_header"
    if [[ $? -ne 0 ]]; then
        return 1
    fi
    
    # Count samples and features
    local samples=$(grep -c "," "$csv_file")
    if [[ "$has_header" == "true" ]]; then
        ((samples--))
    fi
    
    local line=$(head -1 "$csv_file")
    local features=$(echo "$line" | tr -cd ',' | wc -c)
    
    # Normalize data
    normalize_data X $samples $features
    
    # Initialize network
    init_network $features 8 1
    
    # Train network
    train_network X y $samples $features 100
    
    # Make predictions for the first 5 samples
    log "Final predictions (first 5 samples):"
    local predict_samples=$(( samples < 5 ? samples : 5 ))
    predict X $predict_samples $features
    
    # Save the model
    save_model "model.txt"
}

# Main function
main() {
    if [[ $# -lt 1 ]]; then
        echo "Neural Network in Bash"
        echo "======================="
        echo "Usage: $0 <command> [options]"
        echo ""
        echo "Commands:"
        echo "  xor                Run XOR example"
        echo "  csv <file> [header] Train on CSV file (header=true/false, default=true)"
        echo "  predict <model> <file> [header] Predict using saved model on data file"
        echo "  help              Show this help"
        echo ""
        return 0
    fi
    
    local command=$1
    shift
    
    case "$command" in
        xor)
            xor_example
            ;;
        csv)
            csv_example "$@"
            ;;
        predict)
            if [[ $# -lt 2 ]]; then
                log "Usage: $0 predict <model_file> <data_file> [has_header]"
                return 1
            fi
            
            local model_file=$1
            local data_file=$2
            local has_header=${3:-true}
            
            # Load model
            load_model "$model_file"
            
            # Load data
            load_data "$data_file" X y "$has_header"
            
            # Count samples and features
            local samples=$(grep -c "," "$data_file")
            if [[ "$has_header" == "true" ]]; then
                ((samples--))
            fi
            
            local features=$input_size
            
            # Normalize data using the stored min/max
            normalize_data X $samples $features
            
            # Make predictions
            predict X $samples $features
            ;;
        help|*)
            main
            ;;
    esac
}

# Run the script with provided arguments
main "$@"
